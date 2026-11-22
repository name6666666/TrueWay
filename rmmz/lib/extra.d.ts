/*
This file is newly added by mz_setup's author, not this package's original file.
This package lacks some type declarations which RPG maker mz contains.
So I let AI to complement it.
*/

import { RPG } from './RPG';
import { Game_Actor } from './rmmz_objects';

export interface Game_Actors {
  initialize(): void;
  actor(actorId: number): Game_Actor | null;
}

export interface Game_Map {
  initialize(): void;
  setup(mapId: number): void;
  data(): number[];
  width(): number;
  height(): number;
  tileWidth(): number;
  tileHeight(): number;
  mapId(): number;
  displayX(): number;
  displayY(): number;
  playerX(): number;
  playerY(): number;
  isLoopHorizontal(): boolean;
  isLoopVertical(): boolean;
  battleback1Name(): string;
  battleback2Name(): string;
  encounterStep(): number;
  events(): RPG.Event[];
  event(eventId: number): RPG.Event | null;
  eventIdXy(x: number, y: number): number;
  isEventRunning(): boolean;
  isOverworld(): boolean;
  scrollDown(distance: number): void;
  scrollLeft(distance: number): void;
  scrollRight(distance: number): void;
  scrollUp(distance: number): void;
  refresh(): void;
}

export interface Game_Player {
  readonly x: number;
  readonly y: number;
  direction(): number;
  screenX(): number;
  screenY(): number;
  centerX(): number;
  centerY(): number;
  isMoving(): boolean;
  isDashing(): boolean;
  isMenuEnabled(): boolean;
  canMove(): boolean;
  isInVehicle(): boolean;
  inAirship(): boolean;
  moveByInput(): void;
  requestMove(direction: number): boolean;
  setPosition(x: number, y: number): void;
  setDirection(direction: number): void;
  setTransparent(transparent: boolean): void;
  setMenuEnabled(enabled: boolean): void;
  refresh(): void;
}

export interface Game_Temp {
  isPlayTest(): boolean;
  setDestination(x: number, y: number): void;
  clearDestination(): void;
  isDestinationValid(): boolean;
  destinationX(): number;
  destinationY(): number;
  setTouchState(target: Game_Player | RPG.Event | null, state: string): void;
  clearTouchState(): void;
  touchTarget(): Game_Player | RPG.Event | null;
  touchState(): string;
  requestBattleRefresh(): void;
  clearBattleRefreshRequest(): void;
  isBattleRefreshRequested(): boolean;
  reserveCommonEvent(commonEventId: number): void;
  retrieveCommonEvent(): RPG.DataCommonEvent | null;
  isCommonEventReserved(): boolean;
}

export interface Game_Message {
  choices(): string[];
  speakerName(): string;
  faceName(): string;
  faceIndex(): number;
  background(): number;
  positionType(): number;
  choiceDefaultType(): number;
  choiceCancelType(): number;
  choiceBackground(): number;
  choicePositionType(): number;
  numInputVariableId(): number;
  numInputMaxDigits(): number;
  itemChoiceVariableId(): number;
  itemChoiceItypeId(): number;
  scrollMode(): boolean;
  scrollSpeed(): number;
  scrollNoFast(): boolean;
  add(text: string): void;
  setSpeakerName(speakerName: string): void;
  setFaceImage(faceName: string, faceIndex: number): void;
  setBackground(background: number): void;
  setPositionType(positionType: number): void;
  setChoices(choices: string[], defaultType: number, cancelType: number): void;
  setChoiceBackground(background: number): void;
  setChoicePositionType(positionType: number): void;
  setNumberInput(variableId: number, maxDigits: number): void;
  setItemChoice(variableId: number, itemType: number): void;
  setScroll(speed: number, noFast: boolean): void;
  setChoiceCallback(callback: (choiceIndex: number) => void): void;
  onChoice(choiceIndex: number): void;
  hasText(): boolean;
  isChoice(): boolean;
  isNumberInput(): boolean;
  isItemChoice(): boolean;
  isBusy(): boolean;
  newPage(): void;
  allText(): string;
  isRTL(): boolean;
  clear(): void;
}

export declare const $gameActors: Game_Actors;
export declare const $gameMap: Game_Map;
export declare const $gamePlayer: Game_Player;
export declare const $gameTemp: Game_Temp;
export declare const $gameMessage: Game_Message;
export declare const $testEvent: RPG.Event;

