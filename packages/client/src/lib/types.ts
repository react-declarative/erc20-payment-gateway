const baseServices = {
    ethersService: Symbol.for('ethersService'),
    routerService: Symbol.for('routerService'),
    alertService: Symbol.for('alertService'),
    layoutService: Symbol.for('layoutService'),
    connectService: Symbol.for('connectService'),
};

const appServices = {
    paymentGatewayService: Symbol.for('paymentGatewayService'),
    erc20Service: Symbol.for('erc20Service'),
};

export const TYPES = {
    ...baseServices,
    ...appServices,
};

export default TYPES;