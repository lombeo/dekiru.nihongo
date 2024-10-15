export enum CurrencyUnitEnum {
    VND = 0
}

export type CurrencyUnit = {
    type: CurrencyUnitEnum;
    label?: string;
    icon?: any;
};

export const CurrencyType: Array<CurrencyUnit> = [
    {
        label: "VND",
        type: CurrencyUnitEnum.VND,
    },
];
export function getCurrency(type: CurrencyUnitEnum) {
    return CurrencyType.find((x) => {
        return x.type === type;
    });
}

