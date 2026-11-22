declare module 'rmmz' {
    interface SavefileContent {
        name6666666_TrueWay: import('../src/true-way').TrueWayData;
    }

    namespace DataManager {
        interface SavefileContent {
            name6666666_TrueWay: import('../src/true-way').TrueWayData;
        }
    }

    export const $dataMapInfos: RPG.DataMapInfo[];
    export const $dataMap: RPG.DataMap;

    interface SavefileContent {
        actors: Game_Actors;
        map: Game_Map;
        player: Game_Player;
    }

    namespace DataManager {
        interface SavefileContent {
            actors: Game_Actors;
            map: Game_Map;
            player: Game_Player;
        }
    }

    export class Game_Temp {
        isPlayTest(): boolean;
        setDestination(x: number, y: number): void;
        clearDestination(): void;
        isDestinationValid(): boolean;
        destinationX(): number;
        destinationY(): number;
        isBattleRefreshRequested(): boolean;
    }

    export class Game_Message {
        clear(): void;
        choices(): string[];
        speakerName(): string;
        faceName(): string;
        faceIndex(): number;
        background(): number;
        positionType(): number;
        add(text: string): void;
        setSpeakerName(speakerName: string): void;
        setFaceImage(faceName: string, faceIndex: number): void;
        setBackground(background: number): void;
        setPositionType(positionType: number): void;
        setChoices(choices: string[], defaultType: number, cancelType: number): void;
        setChoiceCallback(callback: (n: number) => void): void;
        hasText(): boolean;
        isChoice(): boolean;
        isNumberInput(): boolean;
        isItemChoice(): boolean;
        isBusy(): boolean;
        allText(): string;
        isRTL(): boolean;
    }

    export class Game_Actors {
        [index: number]: Game_Actor;
        initialize(): void;
        actor(actorId: number): Game_Actor | undefined;
        length(): number;
    }

    export class Game_Map {
        initialize(): void;
        setup(mapId: number): void;
        mapId(): number;
        mapName(): string;
        width(): number;
        height(): number;
        tileWidth(): number;
        tileHeight(): number;
        isLoopHorizontal(): boolean;
        isLoopVertical(): boolean;
        displayX(): number;
        displayY(): number;
        parallaxName(): string;
        events(): unknown[];
        event(eventId: number): unknown;
        xWithDirection(x: number, d: number): number;
        yWithDirection(y: number, d: number): number;
        roundX(x: number): number;
        roundY(y: number): number;
        isValid(x: number, y: number): boolean;
    }

    export class Game_Player {
        initialize(): void;
        x: number;
        y: number;
        direction(): number;
        mapX(): number;
        mapY(): number;
        refresh(): void;
        reserveTransfer(mapId: number, x: number, y: number, d?: number): void;
        startMapEvent(mapId: number, eventId: number, isTriggerOn: boolean): void;
    }

    export const $gameTemp: Game_Temp;
    export const $gameMessage: Game_Message;
    export const $gameActors: Game_Actors;
    export const $gameMap: Game_Map;
    export const $gamePlayer: Game_Player;

    export const DataManager: {
        createGameObjects(): void;
        makeSaveContents(): SavefileContent;
        extractSaveContents(contents: SavefileContent): void;
    };

    const rmmz: typeof import('rmmz');
    export default rmmz;
}
