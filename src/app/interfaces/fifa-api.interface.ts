export interface FIFAData {
  ContinuationHash: string;
  ContinuationToken: string;
  Results: FIFADataResult[];
}

export interface FIFADataResult {
  StageName: [
    {
      Locale: string;
      Description: string;
    }
  ];
  GroupName: [
    {
      Locale: string;
      Description: string;
    }
  ];
  Date: string;
  LocalDate: string;
  Home: {
    PictureUrl: string;
    Abbreviation: string;
    ShortClubName: string;
  } | null;
  Away: {
    PictureUrl: string;
    Abbreviation: string;
    ShortClubName: string;
  } | null;
  HomeTeamScore: number | null;
  AwayTeamScore: number | null;
  HomeTeamPenaltyScore: number | null;
  AwayTeamPenaltyScore: number | null;
  MatchTime: string | null;
  MatchStatus: number;
  ResultType: number;
  MatchNumber: number;
  TimeDefined: boolean;
  PlaceHolderA: string;
  PlaceHolderB: string;
}
