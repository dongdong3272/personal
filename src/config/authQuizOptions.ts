export type QuizOption = {
  id: string;
  label: string;
};

/** Correct option id for favorite movie (hash in .env → auth:hash). */
export const FAVORITE_MOVIE_OPTION_ID = "farewell-my-concubine";

/** Correct option id for favorite game (hash in .env → auth:hash). */
export const FAVORITE_GAME_OPTION_ID = "baldurs-gate-3";

export const movieQuizOptions: QuizOption[] = [
  {
    id: "farewell-my-concubine",
    label: "Farewell My Concubine / 霸王别姬",
  },
  { id: "inception", label: "Inception / 盗梦空间" },
  { id: "forrest-gump", label: "Forrest Gump / 阿甘正传" },
  { id: "shutter-island", label: "Shutter Island / 禁闭岛" },
  { id: "infernal-affairs", label: "Infernal Affairs / 无间道" },
];

export const gameQuizOptions: QuizOption[] = [
  { id: "baldurs-gate-3", label: "Baldur's Gate 3" },
  { id: "red-dead-redemption-2", label: "Red Dead Redemption 2" },
  { id: "the-witcher-3", label: "The Witcher 3" },
  { id: "zelda-botw", label: "The Legend of Zelda: Breath of the Wild" },
  { id: "slay-the-spire", label: "Slay the Spire" },
];