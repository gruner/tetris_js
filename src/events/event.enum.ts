export enum Event {
  moveActivePiece        = 'tetris.moveActivePiece',
  rotateActivePiece      = 'tetris.rotateActivePiece',
  accelerateActivePiece  = 'tetris.accelerateActivePiece',
  deccelerateActivePiece = 'tetris.accelerateActivePiece',
  activePiecePositioned  = 'tetris.activePiecePositioned',
  rowComplete            = 'tetris.rowComplete',
  rowCleared             = 'tetris.rowCleared',
  playfieldSettled       = 'tetris.playfieldSettled',
  invalidMove            = 'tetris.invalidMove',
  topOut                 = 'tetris.topOut',
  pause                  = 'tetris.pause',
  animationEnd           = 'tetris.animationEnd'
};
