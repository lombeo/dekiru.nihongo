export enum ContestType {
  Public = 0,
  Share = 1,
  Private = 2,
}

export const getContestType = (type: number) => {
  switch (type) {
    case ContestType.Public:
      return "Public";
    case ContestType.Share:
      return "Share";
    case ContestType.Private:
      return "Private";
    default:
      return "";
  }
};

export enum MemberRole {
  Leader = 0,
  Member = 1,
}

export enum ContestRegisterStatus {
  Waiting = 0,
  Approved = 1,
  Deny = 2,
}

export enum ActivityContextType {
  None,
  Course,
  Contest,
  Training,
  Challenge,
  Evaluating,
  Warehouse,
}

export const getLevelLabel = (levelId: number) => {
  switch (levelId) {
    case 1:
      return "Easy";
    case 2:
      return "Medium";
    case 3:
      return "Hard";
    default:
      return "";
  }
};
