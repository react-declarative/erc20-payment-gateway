import {
  List,
  IColumn,
  ColumnType,
  useArrayPaginator,
  Breadcrumbs,
} from 'react-declarative';

import ioc from '../lib/ioc';

const columns: IColumn[] = [
    {
        type: ColumnType.Text,
        field: 'id',
        headerName: 'Id',
        width: '50px',
    },
    {
        type: ColumnType.Component,
        field: 'sender',
        headerName: 'Sender',
        element: ({ sender }) => (
            <span
                style={{
                    maxWidth: '190px',
                    marginTop: '5px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}
            >
                {sender}
            </span>
        ),
        width: '200px',
    },
    {
        type: ColumnType.Text,
        field: 'amount',
        headerName: 'Amount',
        width: '200px',
    },
    {
        type: ColumnType.Text,
        field: 'data',
        headerName: 'Data',
        width: '200px',
    },
];

interface IRowData {
    id: string;
    sender: string;
    amount: number;
    data: string;
}

const heightRequest = () => {
    return window.innerHeight - 70;
};

export const AdminPage = () => {
  const handler = useArrayPaginator(async () => await ioc.paymentGatewayService.getTransferList(), {
    searchHandler: (rows: IRowData[], search: string) => {
        return rows.filter(({ data, sender }) => (data + sender).toLowerCase().includes(search.toLowerCase()))
    },
    onLoadStart: () => ioc.layoutService.setAppbarLoader(true),
    onLoadEnd: () => ioc.layoutService.setAppbarLoader(false),
  });
  return (
    <>
        <Breadcrumbs
            title="Admin"
            subtitle="Transfer list"
            onBack={() => ioc.routerService.push('/main-page')}
        />
        <List<IRowData>
            withMobile
            title="List Component"
            heightRequest={heightRequest}
            columns={columns}
            handler={handler}
            withSearch
            withArrowPagination
        />
    </>
  );
};


export default AdminPage;
