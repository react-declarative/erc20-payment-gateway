import * as React from 'react';

import { observer } from "mobx-react";

import Snackbar from "@mui/material/Snackbar";

import ioc from '../lib/ioc';

const AUTO_HIDE_DURATION = 5000;

interface IAlertProviderProps {
    children: React.ReactChild;
}

export const AlertProvider = observer(({
    children,
}: IAlertProviderProps) => {
    const { current } = ioc.alertService;
    return (
        <>
            {!!current && (
                <Snackbar
                    open
                    key={current.key}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    autoHideDuration={AUTO_HIDE_DURATION}
                    onClose={ioc.alertService.hideCurrent}
                    message={current.message}
                />
            )}
            {children}
        </>
    );
});

export default AlertProvider;
