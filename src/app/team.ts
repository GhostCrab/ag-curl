
export interface Team {
    name: string;
    gender: 'Men' | 'Women';
    odds: number;
}

export const TEAMS: Team[] = [
    { name: 'Great Britain', gender: 'Men', odds: 185 },
    { name: 'Canada', gender: 'Men', odds: 200 },
    { name: 'Sweden', gender: 'Men', odds: 300 },
    { name: 'Switzerland', gender: 'Men', odds: 800 },
    { name: 'United States', gender: 'Men', odds: 1200 },
    { name: 'Italy', gender: 'Men', odds: 3300 },
    { name: 'Norway', gender: 'Men', odds: 3300 },
    { name: 'China', gender: 'Men', odds: 5000 },
    { name: 'Denmark', gender: 'Men', odds: 5000 },
    { name: 'ROC', gender: 'Men', odds: 5000 },
    { name: 'Canada', gender: 'Women', odds: 200 },
    { name: 'Sweden', gender: 'Women', odds: 260 },
    { name: 'Great Britain', gender: 'Women', odds: 350 },
    { name: 'Switzerland', gender: 'Women', odds: 900 },
    { name: 'Japan', gender: 'Women', odds: 1100 },
    { name: 'South Korea', gender: 'Women', odds: 1400 },
    { name: 'United States', gender: 'Women', odds: 1400 },
    { name: 'ROC', gender: 'Women', odds: 1400 },
    { name: 'China', gender: 'Women', odds: 5000 },
    { name: 'Denmark', gender: 'Women', odds: 8000 },
];
