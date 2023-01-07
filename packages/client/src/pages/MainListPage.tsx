import { useRef, useEffect } from 'react';

import { List, FieldType, ColumnType, ActionType, TypedField, IColumn, IListAction, useArrayPaginator, usePrompt, SelectionMode, IListApi, IListRowAction } from 'react-declarative';

import Delete from '@mui/icons-material/Delete';
import Add from '@mui/icons-material/Add';

import { observer } from 'mobx-react';

import ioc from '../lib/ioc';

const filters: TypedField[] = [
    {
        type: FieldType.Text,
        name: 'content',
        title: 'Content',
    },
    {
        type: FieldType.Checkbox,
        name: 'isDeleted',
        title: 'Deleted',
    },
];

const columns: IColumn[] = [
    {
        type: ColumnType.Text,
        field: 'id',
        headerName: 'ID',
        secondary: true,
        width: () => 50,
    },
    {
        type: ColumnType.Text,
        headerName: 'Content',
        primary: true,
        field: 'content',
        width: (fullWidth) => Math.max(fullWidth - 350, 200),
    },
    {
        type: ColumnType.CheckBox,
        headerName: 'Deleted',
        primary: true,
        field: 'isDeleted',
        width: () => 100,
    },
    {
        type: ColumnType.Action,
        headerName: 'Actions',
        sortable: false,
        width: () => 100,
    },
];

const actions: IListAction[] = [
    {
        type: ActionType.Add,
        action: 'add-action',
    },
    {
        type: ActionType.Menu,
        options: [
            {
                action: 'add-action',
                label: 'Create todo',
                icon: Add,
            },
            {
                action: 'update-now',
            },
        ],
    }
];

const rowActions: IListRowAction[] = [
    {
        label: 'Open todo',
        action: 'open-todo',
    },
    {
        label: 'Delete todo',
        action: 'remove-action',
        isVisible: ({ isDeleted }) => !isDeleted,
        icon: Delete,
    },
];

const heightRequest = () => window.innerHeight - 80;

export const MainListPage = observer(() => {

    const listApiRef = useRef<IListApi>(null as never);

    const pickPrompt = usePrompt({
        title: 'Create a todo',
        placeholder: 'Todo content',
    });

    const handler = useArrayPaginator(async () => await ioc.contractService.todosOfEveryone(), {
        onLoadStart: () => ioc.layoutService.setAppbarLoader(true),
        onLoadEnd: () => ioc.layoutService.setAppbarLoader(false),
    });

    useEffect(() => ioc.contractService.updateSubject.subscribe(async () => {
        try {
            await listApiRef.current.reload();
        } catch {
            ioc.alertService.notify('An error acquired while applying new transaction');
        }
    }), []);

    const handleRowActionsClick = async (action: string, { id: rowId }: any) => {
        const { getState, setRows } = listApiRef.current;
        ioc.layoutService.setAppbarLoader(true);
        try {
            if (action === 'open-todo') {
                ioc.routerService.push(`/main-page/${rowId}`);
            } else if (action === 'remove-action') {
                await ioc.contractService.removeTodoById(rowId);
                const { rows } = getState();
                setRows(rows.map((row) => row.id === rowId ? { ...row, isDeleted: true } : row));
            }
        } catch {
            ioc.alertService.notify('An error acquired')
        } finally {
            ioc.layoutService.setAppbarLoader(false);
        }
    };

    const handleAddTodo = async (content: string) => {
        ioc.layoutService.setAppbarLoader(true);
        try {
            await ioc.contractService.addTodo(content);
            ioc.alertService.notify('Waiting for a transaction to be confirmed');
        } catch {
            ioc.alertService.notify('An error acquired');
        } finally {
            ioc.layoutService.setAppbarLoader(false);
        }
    };

    const handleAction = (action: string) => {
        if (action === 'add-action') {
            pickPrompt().then((data) => {
                if (data) {
                    handleAddTodo(data);
                }
            });
        }
    };

    const handleClick = (row: any) => {
        ioc.routerService.push(`/main-page/${row.id}`);
    };

    return (
        <List
            apiRef={listApiRef}
            title="Todo list"
            filterLabel="Filters"
            heightRequest={heightRequest}
            rowActions={rowActions}
            actions={actions}
            filters={filters}
            columns={columns}
            handler={handler}
            onRowAction={handleRowActionsClick}
            onAction={handleAction}
            onRowClick={handleClick}
            selectionMode={SelectionMode.Multiple}
        />
    );
});

export default MainListPage;
