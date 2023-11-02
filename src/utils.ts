const COLOR_COMBOS = [
  "#00ffr",
  "#00rff",
  "#r00ff",
  "#ff00r",
  "#ffr00",
  "#rff00",
];

export const getRandomColor = (): string => {
  const col = Math.floor(Math.random() * 255).toString(16);
  const i = Math.floor(Math.random() * 5.999);

  return COLOR_COMBOS[i].replace("r", col);
};

const BACKGROUND_COLORS = [
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#000000",
  "#000000",
  "#000000",
  "#454545",
  "#7c7c7c",
  "#b7b7b7",
  "#ff0000",
  "#f2ff00",
  "#c2ff00",
  "#59ff00",
  "#0000ff",
  "ff00f9",
];

export const getRandomBgColor = (): string => {
  return BACKGROUND_COLORS[
    Math.floor(Math.random() * (BACKGROUND_COLORS.length - 1.001))
  ];
};

export const isColorDark = (color: string): boolean => {
  return (
    parseInt(color.slice(1, 3), 16) < 170 &&
    parseInt(color.slice(3, 5), 16) < 170 &&
    parseInt(color.slice(5, 7), 16) < 170
  );
};
