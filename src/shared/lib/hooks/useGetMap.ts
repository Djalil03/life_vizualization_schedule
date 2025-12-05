import { useMemo } from "react";

export const useGetMap = <K, V>(entries: [K, V][]): Map<K, V> => {
    return useMemo(() => {
        return new Map(entries);
    }, [entries]);
};