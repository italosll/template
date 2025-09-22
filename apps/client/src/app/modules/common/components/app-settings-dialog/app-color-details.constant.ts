import { ColorPalettesEnum } from "@client/common/enums/color-palettes.enum";

export const COLOR_DETAILS: Partial<{
  [index in ColorPalettesEnum]: {
    description: string;
    hexadecimalColorCode: string;
  };
}> = {
  [ColorPalettesEnum.azure]: {
    description: "azul",
    hexadecimalColorCode: "#abc7ff",
  },
  [ColorPalettesEnum.rose]: {
    description: "rosa",
    hexadecimalColorCode: "#ffb1c5",
  },
};
