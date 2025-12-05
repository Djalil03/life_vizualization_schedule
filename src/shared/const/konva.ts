export const STAGE_WIDTH = 1500;
export const STAGE_HEIGHT = 800;
export const PADDING_X = 50;

export const NODE_HEIGHT = 40;
export const VERTICAL_GAP = 60;

export const CATEGORY_COLORS: Record<string, string> = {
  'education': '#1E88E5', // Синий
  'career': '#43A047',    // Зеленый
  'projects': '#FF9800',  // Оранжевый
  'personal': '#E53935',  // Красный
};

// Карта позиций Y (Swimlanes). Позже можно сделать динамической.
export const CATEGORY_Y_MAP: Record<string, number> = {
  'education': 100,
  'career': 200,
  'projects': 300,
  'personal': 400,
};
