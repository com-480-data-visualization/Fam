import { StatusColorMap } from "./types";

export const COLOR_SETS = {
  statusColors: {
    "Launch Successful": "rgba(0, 128, 0, 0.7)",
    "Launch Failure": "rgba(255, 0, 0, 0.7)",
    "Launch was a Partial Failure": "rgba(255, 165, 0, 0.7)",
    "To Be Determined": "rgba(100, 149, 237, 0.7)",
    "Go for Launch": "rgba(65, 105, 225, 0.7)",
    "To Be Confirmed": "rgba(30, 144, 255, 0.7)",
    default: "rgba(128, 128, 128, 0.7)",
  } as StatusColorMap,

  hoverStatusColors: {
    "Launch Successful": "rgba(0, 160, 0, 1)",
    "Launch Failure": "rgba(255, 0, 0, 1)",
    "Launch was a Partial Failure": "rgba(255, 185, 0, 1)",
    "To Be Determined": "rgba(120, 169, 255, 1)",
    "Go for Launch": "rgba(85, 125, 245, 1)",
    "To Be Confirmed": "rgba(50, 164, 255, 1)",
    default: "rgba(150, 150, 150, 1)",
  } as StatusColorMap,
};
