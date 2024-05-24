export interface UEFAMatch {
  awayTeam:          Team;
  behindClosedDoors: boolean;
  competition:       Competition;
  fullTimeAt?:       Date;
  homeTeam:          Team;
  id:                string;
  kickOffTime:       KickOffTime;
  lineupStatus:      LineupStatus;
  matchAttendance?:  number;
  matchday:          Matchday;
  playerEvents?:     PlayerEvents;
  referees:          Referee[];
  round:             Round;
  score?:            Score;
  seasonYear:        string;
  sessionNumber:     number;
  stadium:           Stadium;
  status:            Status;
  type:              UEFADatumType;
  winner?:           Winner;
  group?:            Group;
  matchNumber?:      number;
}

export interface Team {
  associationId?:      string;
  associationLogoUrl?: string;
  bigLogoUrl:          string;
  confederationType?:  ConfederationType;
  countryCode?:        string;
  id:                  string;
  idProvider:          IDProvider;
  internationalName:   string;
  isPlaceHolder:       boolean;
  logoUrl:             string;
  mediumLogoUrl:       string;
  organizationId?:     string;
  teamCode:            string;
  teamTypeDetail:      TeamTypeDetail;
  translations:        AwayTeamTranslations;
  typeIsNational:      boolean;
  typeTeam:            TypeTeam;
}

export enum ConfederationType {
  Uefa = "UEFA",
}

export enum IDProvider {
  Fame = "FAME",
}

export enum TeamTypeDetail {
  Fake = "FAKE",
  NationalMenTeamA = "NATIONAL_MEN_TEAM_A",
}

export interface AwayTeamTranslations {
  countryName?:        CountryName;
  displayName:         CountryName;
  displayOfficialName: CountryName;
  displayTeamCode:     CountryName;
}

export interface CountryName {
  EN:  string;
  FR:  string;
  DE:  string;
  ES:  string;
  PT:  string;
  IT:  string;
  RU:  string;
  ZH?: string;
  TR:  string;
  HU:  string;
  CS:  string;
  NL:  string;
}

export enum TypeTeam {
  National = "NATIONAL",
  Placeholder = "PLACEHOLDER",
}

export interface Competition {
  age:          Age;
  code:         Code;
  id:           string;
  images:       CompetitionImages;
  metaData:     CompetitionMetaData;
  region:       Region;
  sex:          Sex;
  sportsType:   SportsType;
  teamCategory: TypeTeam;
  translations: CompetitionTranslations;
  type:         CompetitionType;
}

export enum Age {
  Adult = "ADULT",
}

export enum Code {
  Euro = "EURO",
}

export interface CompetitionImages {
  FULL_LOGO: string;
}

export interface CompetitionMetaData {
  name: PurpleName;
}

export enum PurpleName {
  EuropeanChampionship = "European Championship",
}

export enum Region {
  Continental = "CONTINENTAL",
}

export enum Sex {
  Male = "MALE",
}

export enum SportsType {
  Football = "FOOTBALL",
}

export interface CompetitionTranslations {
  name:              CountryName;
  prequalifyingName: CountryName;
  qualifyingName:    CountryName;
  tournamentName:    CountryName;
}

export enum CompetitionType {
  Cup = "CUP",
}

export interface Group {
  competitionId:        string;
  id:                   string;
  metaData:             GroupMetaData;
  order:                number;
  phase:                GroupPhase;
  roundId:              string;
  seasonYear:           string;
  teams:                string[];
  teamsQualifiedNumber: number;
  translations:         GroupTranslations;
  type:                 GroupType;
}

export interface GroupMetaData {
  groupName:      string;
  groupShortName: string;
}

export enum GroupPhase {
  Qualifying = "QUALIFYING",
  Tournament = "TOURNAMENT",
}

export interface GroupTranslations {
  name:      CountryName;
  shortName: CountryName;
}

export enum GroupType {
  Standard = "STANDARD",
}

export interface KickOffTime {
  date:             Date;
  dateTime:         Date;
  utcOffsetInHours: number;
}

export enum LineupStatus {
  NotAvailable = "NOT_AVAILABLE",
  TacticalAvailable = "TACTICAL_AVAILABLE",
}

export interface Matchday {
  competitionId:  string;
  dateFrom:       string;
  dateTo:         string;
  format:         Format;
  id:             string;
  longName:       string;
  name:           string;
  roundId:        string;
  seasonYear:     string;
  sequenceNumber: string;
  translations:   MatchdayTranslations;
  type:           MatchdayType;
}

export enum Format {
  ExtraTimeWithPenalties = "EXTRA_TIME_WITH_PENALTIES",
  Regular = "REGULAR",
}

export interface MatchdayTranslations {
  longName: CountryName;
  name:     CountryName;
}

export enum MatchdayType {
  Final = "FINAL",
  Matchday = "MATCHDAY",
}

export interface PlayerEvents {
  redCards?:        PenaltyScorer[];
  scorers?:         Scorer[];
  penaltiesMissed?: PenaltiesMissed[];
  penaltyScorers?:  PenaltyScorer[];
}

export interface PenaltiesMissed {
  id:             string;
  images:         PenaltiesMissedImages;
  penaltyType:    PenaltyType;
  phase:          PenaltiesMissedPhase;
  player:         PenaltiesMissedPlayer;
  teamId:         string;
  teamIdProvider: IDProvider;
  time:           PenaltiesMissedTime;
}

export interface PenaltiesMissedImages {
  PLAYER_CELEBRATING: string;
}

export enum PenaltyType {
  Missed = "MISSED",
  Scored = "SCORED",
}

export enum PenaltiesMissedPhase {
  ExtraTimeSecondHalf = "EXTRA_TIME_SECOND_HALF",
  FirstHalf = "FIRST_HALF",
  Penalty = "PENALTY",
  SecondHalf = "SECOND_HALF",
}

export interface PenaltiesMissedPlayer {
  age:                    string;
  birthDate:              Date;
  clubId:                 string;
  clubJerseyNumber?:      string;
  clubShirtName:          string;
  countryCode:            string;
  countryOfBirthCode?:    string;
  detailedFieldPosition?: string;
  fieldPosition:          FieldPosition;
  gender:                 Sex;
  height?:                number;
  id:                     string;
  imageUrl:               string;
  internationalName:      string;
  nationalFieldPosition:  FieldPosition;
  nationalJerseyNumber?:  string;
  nationalShirtName:      string;
  nationalTeamId:         string;
  translations:           PlayerTranslations;
  weight?:                number;
}

export enum FieldPosition {
  Defender = "DEFENDER",
  Forward = "FORWARD",
  Goalkeeper = "GOALKEEPER",
  Midfielder = "MIDFIELDER",
}

export interface PlayerTranslations {
  countryName:           CountryName;
  countryOfBirthName?:   CountryName;
  fieldPosition:         CountryName;
  firstName:             CountryName;
  lastName:              CountryName;
  name:                  CountryName;
  nationalFieldPosition: CountryName;
  shortName:             CountryName;
}

export interface PenaltiesMissedTime {
  minute: number;
  second: number;
}

export interface PenaltyScorer {
  id:             string;
  images:         PenaltiesMissedImages;
  penaltyType?:   PenaltyType;
  phase:          PenaltiesMissedPhase;
  player:         PenaltyScorerPlayer;
  teamId:         string;
  teamIdProvider: IDProvider;
  time?:          PenaltyScorerTime;
}

export interface PenaltyScorerPlayer {
  age:                    string;
  birthDate:              Date;
  clubId:                 string;
  clubJerseyNumber?:      string;
  clubShirtName:          string;
  countryCode:            string;
  fieldPosition:          FieldPosition;
  gender:                 Sex;
  id:                     string;
  imageUrl:               string;
  internationalName:      string;
  nationalFieldPosition:  FieldPosition;
  nationalJerseyNumber:   string;
  nationalShirtName:      string;
  nationalTeamId:         string;
  translations:           PlayerTranslations;
  detailedFieldPosition?: string;
  height?:                number;
  weight?:                number;
}

export interface PenaltyScorerTime {
  minute:        number;
  second:        number;
  injuryMinute?: number;
}

export interface Scorer {
  goalType:       GoalType;
  id:             string;
  images:         PenaltiesMissedImages;
  phase:          PenaltiesMissedPhase;
  player:         PenaltiesMissedPlayer;
  teamId:         string;
  teamIdProvider: IDProvider;
  time:           PenaltiesMissedTime;
}

export enum GoalType {
  Own = "OWN",
  Penalty = "PENALTY",
  Scored = "SCORED",
}

export interface Referee {
  images:       RefereeImages;
  person:       Person;
  role:         Role;
  translations: RefereeTranslations;
}

export interface RefereeImages {
  SMALL_SQUARE: string;
}

export interface Person {
  countryCode:  string;
  gender:       Sex;
  id:           string;
  translations: PersonTranslations;
}

export interface PersonTranslations {
  countryName: CountryName;
  firstName:   CountryName;
  lastName:    CountryName;
  name:        CountryName;
  shortName:   CountryName;
}

export enum Role {
  AssistantRefereeOne = "ASSISTANT_REFEREE_ONE",
  AssistantRefereeTwo = "ASSISTANT_REFEREE_TWO",
  AssistantVideoAssistantReferee = "ASSISTANT_VIDEO_ASSISTANT_REFEREE",
  FourthOfficial = "FOURTH_OFFICIAL",
  Referee = "REFEREE",
  RefereeObserver = "REFEREE_OBSERVER",
  UefaDelegate = "UEFA_DELEGATE",
  VideoAssistantReferee = "VIDEO_ASSISTANT_REFEREE",
}

export interface RefereeTranslations {
  roleName: CountryName;
}

export interface Round {
  active:                 boolean;
  benchGKCount:           number;
  benchPlayersCount:      number;
  benchStaffCount:        number;
  coefficientWinnerBonus: number;
  competitionId:          string;
  dateFrom:               DateFrom;
  dateTo:                 DateTo;
  fieldPlayersCount:      number;
  groupCount:             number;
  id:                     string;
  metaData:               RoundMetaData;
  mode:                   Mode;
  modeDetail:             ModeDetail;
  orderInCompetition:     number;
  phase:                  GroupPhase;
  seasonYear:             string;
  secondaryType?:         SecondaryType;
  stadiumNameType:        StadiumNameType;
  status:                 Status;
  substitutionCount:      number;
  teamCount:              number;
  teams:                  string[];
  translations:           RoundTranslations;
}

export enum DateFrom {
  The20240208T2300000000 = "2024-02-08T23:00:00+0000",
  The20240321T2300000000 = "2024-03-21T23:00:00+0000",
  The20240613T2200000000 = "2024-06-13T22:00:00+0000",
  The20240626T2200000000 = "2024-06-26T22:00:00+0000",
  The20240704T2200000000 = "2024-07-04T22:00:00+0000",
  The20240708T2200000000 = "2024-07-08T22:00:00+0000",
  The20240713T2200000000 = "2024-07-13T22:00:00+0000",
}

export enum DateTo {
  The20240321T2259590000 = "2024-03-21T22:59:59+0000",
  The20240613T2159590000 = "2024-06-13T21:59:59+0000",
  The20240626T2159590000 = "2024-06-26T21:59:59+0000",
  The20240702T2159590000 = "2024-07-02T21:59:59+0000",
  The20240706T2159590000 = "2024-07-06T21:59:59+0000",
  The20240710T2159590000 = "2024-07-10T21:59:59+0000",
  The20240714T2159590000 = "2024-07-14T21:59:59+0000",
}

export interface RoundMetaData {
  name: FluffyName;
  type: MetaDataType;
}

export enum FluffyName {
  Final = "Final",
  FinalTournament = "Final tournament",
  PlayOffFinals = "Play-off Finals",
  PlayOffSemiFinals = "Play-off Semi-finals",
  QuarterFinals = "Quarter-finals",
  RoundOf16 = "Round of 16",
  SemiFinals = "Semi-finals",
}

export enum MetaDataType {
  Final = "FINAL",
  FinalTournamentPlayOff = "FINAL_TOURNAMENT_PLAY_OFF",
  GroupStandings = "GROUP_STANDINGS",
  QuarterFinals = "QUARTER_FINALS",
  RoundOf16 = "ROUND_OF_16",
  Semifinal = "SEMIFINAL",
}

export enum Mode {
  Final = "FINAL",
  Group = "GROUP",
  KnockOut = "KNOCK_OUT",
}

export enum ModeDetail {
  Group = "GROUP",
  KnockOutOneLeg = "KNOCK_OUT_ONE_LEG",
}

export enum SecondaryType {
  Finals = "FINALS",
  GroupPhase = "GROUP_PHASE",
  KnockoutPhase = "KNOCKOUT_PHASE",
  Playoff = "PLAYOFF",
}

export enum StadiumNameType {
  SpecialEventsName = "SPECIAL_EVENTS_NAME",
  SponsorName = "SPONSOR_NAME",
}

export enum Status {
  Current = "CURRENT",
  Finished = "FINISHED",
  Upcoming = "UPCOMING",
}

export interface RoundTranslations {
  abbreviation: CountryName;
  name:         CountryName;
  shortName:    CountryName;
}

export interface Score {
  regular:  Penalty;
  total:    Penalty;
  penalty?: Penalty;
}

export interface Penalty {
  away: number;
  home: number;
}

export interface Stadium {
  address:      string;
  capacity:     number;
  city:         City;
  countryCode:  CountryCode;
  geolocation:  Geolocation;
  id:           string;
  images:       StadiumImages;
  openingDate:  Date;
  pitch:        Pitch;
  translations: StadiumTranslations;
}

export interface City {
  countryCode:  CountryCode;
  id:           string;
  translations: CityTranslations;
}

export enum CountryCode {
  Bih = "BIH",
  Geo = "GEO",
  Ger = "GER",
  Gre = "GRE",
  Hun = "HUN",
  Pol = "POL",
  Wal = "WAL",
}

export interface CityTranslations {
  name: CountryName;
}

export interface Geolocation {
  latitude:  number;
  longitude: number;
}

export interface StadiumImages {
  MEDIUM_WIDE:      string;
  LARGE_ULTRA_WIDE: string;
}

export interface Pitch {
  length: number;
  width:  number;
}

export interface StadiumTranslations {
  mediaName:         CountryName;
  name:              CountryName;
  officialName:      CountryName;
  specialEventsName: CountryName;
  sponsorName:       CountryName;
}

export enum UEFADatumType {
  GroupStage = "GROUP_STAGE",
  Single = "SINGLE",
}

export interface Winner {
  match: MatchResult;
}

export interface MatchResult {
  reason:        string;
  team:          Team;
  translations?: MatchTranslations;
}

export interface MatchTranslations {
  reasonText:     CountryName;
  reasonTextAbbr: CountryName;
}
