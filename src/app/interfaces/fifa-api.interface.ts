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
    };
    Away: {
        PictureUrl: string;
        Abbreviation: string;
        ShortClubName: string;
    };
    HomeTeamScore: number | null;
    AwayTeamScore: number | null;
    HomeTeamPenaltyScore: number | null;
    AwayTeamPenaltyScore: number | null;
    MatchTime: string | null;
    MatchStatus: number;
    ResultType: number;
    MatchNumber: number;
    TimeDefined: boolean;
}
