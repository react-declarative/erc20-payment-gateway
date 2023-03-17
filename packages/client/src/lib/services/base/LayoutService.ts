import { makeAutoObservable } from 'mobx';

export class LayoutService {

    private _modalLoading = 0;
    private _appbarLoading = 0;

    get hasModalLoader() {
        return !!this._modalLoading;
    };

    get hasAppbarLoader() {
        return !!this._appbarLoading;
    };

    constructor() {
        makeAutoObservable(this);
    }

    setModalLoader = (loading: boolean) => {
        this._modalLoading = Math.max(this._modalLoading + (loading ? 1 : -1), 0);
    };

    setAppbarLoader = (loading: boolean) => {
        this._appbarLoading = Math.max(this._appbarLoading + (loading ? 1 : -1), 0);
    };

}

export default LayoutService;
