type UpdateCheckerArgs<T> = {
  currentData: T;
  newData: Partial<T>;
};

export function hasChanges<T>({
  currentData,
  newData,
}: UpdateCheckerArgs<T>): boolean {
  return Object.keys(newData).some((key) => {
    const currentValue = currentData[key as keyof T];
    const newValue = newData[key as keyof T];

    // Handle arrays (e.g., tags or images)
    if (Array.isArray(currentValue) && Array.isArray(newValue)) {
      return (
        currentValue.length !== newValue.length ||
        currentValue.some((item, index) => item !== newValue[index])
      );
    }

    return currentValue !== newValue;
  });
}
