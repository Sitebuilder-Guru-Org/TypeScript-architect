export interface Container {
    rows: string[];
    id: string;
}

export interface Row {
    id: string;
    columns: Column[];
    preset: number[];
}

export interface Column {
    span: number;
    id: string;
}
