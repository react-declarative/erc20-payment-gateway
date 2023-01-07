const baseServices = {
    ethersService: Symbol.for('ethersService'),
    contractService: Symbol.for('contractService'),
    routerService: Symbol.for('routerService'),
    alertService: Symbol.for('alertService'),
    layoutService: Symbol.for('layoutService'),
    connectService: Symbol.for('connectService'),
};

export const TYPES = {
    ...baseServices,
};

export default TYPES;