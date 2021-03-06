import {Injectable} from "@angular/core";
import "assets/background.js";
import {STATE} from "../../api/States";
import {Service} from "../../api/Service";

export enum ACTION {
  CLOSE_MATRIX,
  REFRESH,
  FORWARD,
  BACK,
  HOME_PAGE,
  NO_ACTION,
  GAP_LETTERS,
  SEARCH,
  URL
}

declare var backgroundScript: any;

@Injectable()
export class OpenMatrixService implements Service {
  private selectorIndex = {row: 0, col: 0};
  private letters =
    [[ACTION.NO_ACTION, ACTION.BACK, ACTION.FORWARD, ACTION.CLOSE_MATRIX],
      [ACTION.HOME_PAGE, ACTION.REFRESH, ACTION.SEARCH, ACTION.GAP_LETTERS],
      ['A', 'B', 'C', 'D'],
      ['E', 'F', 'G', 'H'],
      ['I', 'J', 'K', 'L'],
      ['M', 'N', 'O', 'P'],
      ['Q', 'R', 'S', 'T'],
      ['U', 'V', 'W', 'X'],
      ['Y', 'Z', ACTION.URL, ACTION.NO_ACTION]];

  private dataReceivedThreshold = 8;

  constructor() {
  }

  public getState() {
    return 'open';
  }

  public getHeadSensibility() {
    return 600;
  }

  public click() {
    const clickedIcon = this.letters[this.selectorIndex.row][this.selectorIndex.col];
    if (this.isLetter(clickedIcon)) {
      backgroundScript.doNavigation(clickedIcon);
    } else if (clickedIcon === ACTION.NO_ACTION) {
      return 'none';
    } else if (clickedIcon === ACTION.REFRESH) {
      backgroundScript.refresh();
    } else if (clickedIcon === ACTION.BACK) {
      backgroundScript.back();
    } else if (clickedIcon === ACTION.FORWARD) {
      backgroundScript.forward();
    } else if (clickedIcon === ACTION.HOME_PAGE) {
      backgroundScript.home();
    } else if (clickedIcon === ACTION.GAP_LETTERS) {
      backgroundScript.gapLetters();
      return 'none'
    } else if (clickedIcon === ACTION.SEARCH) {
      backgroundScript.submitForm();
    } else if (clickedIcon === ACTION.URL) {
      backgroundScript.url();
      return STATE.GENERIC_KEYBOARD
    }
  }

  public shouldHighlight(row, col) {
    return row === this.selectorIndex.row && col === this.selectorIndex.col;
  }

  public getLetter() {
    return this.letters;
  }

  public headDown() {
    if (this.selectorIndex.row < this.letters.length - 1) {
      const exitLetterIndexes = Object.assign({}, this.selectorIndex);
      this.selectorIndex.row++;
      this.backgroundColorChange(exitLetterIndexes);
    }
  }

  public headUp() {
    if (this.selectorIndex.row > 0) {
      const exitLetterIndexes = Object.assign({}, this.selectorIndex);
      this.selectorIndex.row--;
      this.backgroundColorChange(exitLetterIndexes);
    }
  }

  public headRight() {
    if (this.selectorIndex.col < this.letters[0].length - 1) {
      const exitLetterIndexes = Object.assign({}, this.selectorIndex);
      this.selectorIndex.col++;
      this.backgroundColorChange(exitLetterIndexes);
    }
  }

  public headLeft() {
    if (this.selectorIndex.col > 0) {
      const exitLetterIndexes = Object.assign({}, this.selectorIndex);
      this.selectorIndex.col--;
      this.backgroundColorChange(exitLetterIndexes);
    }
  }

  public getImgSrc(str) {
    var src = "";

    if (str === ACTION.CLOSE_MATRIX) {
      src = "assets/icons/close_matrix_icon.png";
    } else if (str === ACTION.BACK) {
      src = "assets/icons/back_icon.png";
    } else if (str === ACTION.FORWARD) {
      src = "assets/icons/forward_icon.png";
    } else if (str === ACTION.REFRESH) {
      src = "assets/icons/refresh_icon.png";
    } else if (str === ACTION.HOME_PAGE) {
      src = "assets/icons/homepage_icon.png";
    } else if (str === ACTION.NO_ACTION) {
      src = "assets/icons/no_action_icon.png";
    } else if (str == ACTION.SEARCH) {
      src = "assets/icons/search_icon.png";
    } else if (str == ACTION.GAP_LETTERS) {
      src = "assets/icons/gap_icon.png";
    } else if (str === ACTION.URL) {
      src = "assets/icons/url_icon2.png";
    }

    return src;
  }

  private isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
  }

  private backgroundColorChange(exitLetterIndex) {
    const exitLetter = this.letters[exitLetterIndex.row][exitLetterIndex.col];
    const enterLetter = this.letters[this.selectorIndex.row][this.selectorIndex.col];
    if (this.isLetter(enterLetter) || this.isLetter(exitLetter)) {
      backgroundScript.matrixLetterChange(exitLetter, enterLetter);
    }
  }
}
