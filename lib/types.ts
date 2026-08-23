export type Team = { id: number; name: string; color: string; text_color: string; image_url: string }
export type Game = { id: number; season: string; round: number; start_at_brazil: string; home_team: Team; away_team: Team; home_score: number | null; away_score: number | null }
