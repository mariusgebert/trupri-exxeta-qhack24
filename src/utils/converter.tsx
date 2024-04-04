export const gramsToKilograms = (g: number) => {
  return (
    (g / 1000).toLocaleString('de-DE', { maximumFractionDigits: 2 }) + ' kg'
  );
};

export const mltoLiter = (ml: number) => {
  return (
    (ml / 1000).toLocaleString('de-DE', { maximumFractionDigits: 2 }) + ' l'
  );
};

export const gramsToTons = (ml: number) => {
  return (
    (ml / 1000000).toLocaleString('de-DE', {
      maximumFractionDigits: 3,
    }) + ' t'
  );
};
