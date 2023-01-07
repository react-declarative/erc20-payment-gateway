import { useRef, useState } from 'react';

import { FetchView, Breadcrumbs, One, ActionTrigger, FieldType, TypedField, usePreventLeave, IActionTrigger, IOneApi } from 'react-declarative';

import { observer } from 'mobx-react';

import ioc from '../lib/ioc';

interface ITodoOnePageProps {
    id: string;
}

const fields: TypedField[] = [
    {
        type: FieldType.Line,
        title: 'System info'
    },
    {
        type: FieldType.Div,
        style: {
          display: 'grid',
          gridTemplateColumns: '225px 1fr auto',
        },
        fields: [
            {
                type: FieldType.Text,
                name: 'id',
                title: 'Todo id',
                outlined: false,
                disabled: true,
            },
            {
                type: FieldType.Text,
                name: 'owner',
                title: 'Owner',
                outlined: false,
                disabled: true,
            },
            {
                type: FieldType.Checkbox,
                fieldBottomMargin: "0",
                name: 'isDeleted',
                title: "Deleted",
                disabled: true,
            },
        ]
    },
    {
        type: FieldType.Line,
        title: 'Common info'
    },
    {
        type: FieldType.Text,
        name: 'content',
        title: 'Content',
    },
];

const actions: IActionTrigger<ITodoItem>[] = [
    {
        isAvailable: ({ isDeleted }) => !isDeleted,
        action: 'delete-action',
        label: 'Delete this todo',
    },
];

interface ITodoItem {
    id: number;
    content: string;
    owner: string;
    isDeleted: boolean;
}

export const TodoOnePage = observer(({
    id,
}: ITodoOnePageProps) => {

    const fetchState = async () => {
        ioc.layoutService.setAppbarLoader(true);
        try {
            const todoId = parseInt(id);
            return await ioc.contractService.getTodoById(Number.isNaN(todoId) ? -1 : todoId);
        } catch (e: any) {
            const { message = 'It looks like token impoty failed with exception. More info in debug console' } = e;
            ioc.alertService.notify(message);
            console.warn('It looks like token import failed with exception', e);
            return null;
        } finally {
            ioc.layoutService.setAppbarLoader(false);
        }
    };

    const Content = observer((props: any) => {

        const [todo, setTodo] = useState(props.todo);

        const oneApiRef = useRef<IOneApi>(null as never);

        const {
            data,
            oneProps,
            beginSave,
            afterSave,
        } = usePreventLeave<ITodoItem>({
            history: ioc.routerService,
            onSave: async () => {
                ioc.layoutService.setAppbarLoader(true);
                try {
                    const todoId = parseInt(id);
                    await ioc.contractService.setTodoText(Number.isNaN(todoId) ? -1 : todoId, todo.content);
                    return true;
                } catch (e: any) {
                    const { message = 'It looks like token impoty failed with exception. More info in debug console' } = e;
                    ioc.alertService.notify(message);
                    console.warn('It looks like token import failed with exception', e);
                    return false;
                } finally {
                    ioc.layoutService.setAppbarLoader(false);
                }
            },
            onChange: (todo) => setTodo(todo),
        });

        const handleAction = async (action: string) => {
            const { change } = oneApiRef.current;
            try {
                if (action === "delete-action") {
                    const todoId = parseInt(id);
                    await ioc.contractService.removeTodoById(Number.isNaN(todoId) ? -1 : todoId);
                    change({
                        ...(data || props.todo),
                        isDeleted: true,
                    });
                    afterSave();
                }
            } catch (e: any) {
                const { message = 'It looks like token impoty failed with exception. More info in debug console' } = e;
                ioc.alertService.notify(message);
                console.warn('It looks like token import failed with exception', e);
            }
        };

        return (
            <>
                <Breadcrumbs
                    withSave
                    title="Todo list"
                    subtitle={props.todo.title}
                    onSave={beginSave}
                    onBack={() => ioc.routerService.push('/main-page')}
                    saveDisabled={!data}
                />
                <ActionTrigger
                    payload={todo}
                    actions={actions}
                    onAction={handleAction}
                />
                <One<ITodoItem>
                    apiRef={oneApiRef}
                    handler={() => props.todo}
                    fields={fields}
                    {...oneProps}
                />
            </>
        );
    });

    return (
        <FetchView state={fetchState}>
            {(todo) => (
                <Content todo={todo} />
            )}
        </FetchView>
    );
});

export default TodoOnePage;