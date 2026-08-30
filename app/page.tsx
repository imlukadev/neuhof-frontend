"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Radio,
  Shield,
  Trophy,
} from "lucide-react";

import { getGames } from "../lib/api";
import type { Game, Team } from "../lib/types";

/**
 * Configuration
 *
 * true  -> shows upcoming and past games
 * false -> hides all games and assumes the live stream is available
 */
const SHOW_GAMES = false;

const sampleGames: Game[] = [
  {
    id: 16890409,
    season: "Gruppenliga Region Fulda 26/27",
    round: 7,
    start_at_brazil: "2026-08-30T10:00:00-03:00",
    home_team: {
      id: 323243,
      name: "SV Neuhof",
      color: "#b8e3a2",
      text_color: "#14311f",
      image_url: "https://img.sofascore.com/api/v1/team/323243/image",
    },
    away_team: {
      id: 1095698,
      name: "SV 1919 Hofbieber",
      color: "#3858d6",
      text_color: "#fff",
      image_url: "https://img.sofascore.com/api/v1/team/1095698/image",
    },
    home_score: null,
    away_score: null,
  },
  {
    id: 16890414,
    season: "Gruppenliga Region Fulda 26/27",
    round: 8,
    start_at_brazil: "2026-09-05T10:30:00-03:00",
    home_team: {
      id: 510252,
      name: "SG Eiterfeld/Leimbach",
      color: "#3858d6",
      text_color: "#fff",
      image_url: "https://img.sofascore.com/api/v1/team/510252/image",
    },
    away_team: {
      id: 323243,
      name: "SV Neuhof",
      color: "#b8e3a2",
      text_color: "#14311f",
      image_url: "https://img.sofascore.com/api/v1/team/323243/image",
    },
    home_score: null,
    away_score: null,
  },
  {
    id: 16291067,
    season: "Gruppenliga Fulda 25/26",
    round: 3,
    start_at_brazil: "2025-09-17T14:00:00-03:00",
    home_team: {
      id: 323243,
      name: "SV Neuhof",
      color: "#b8e3a2",
      text_color: "#14311f",
      image_url: "https://img.sofascore.com/api/v1/team/323243/image",
    },
    away_team: {
      id: 1235507,
      name: "SG Bad Soden II",
      color: "#3858d6",
      text_color: "#fff",
      image_url: "https://img.sofascore.com/api/v1/team/1235507/image",
    },
    home_score: 0,
    away_score: 2,
  },
];

function isLive(game: Game) {
  return (
    game.home_score === null &&
    Date.now() >= new Date(game.start_at_brazil).getTime() &&
    Date.now() <= new Date(game.start_at_brazil).getTime() + 7200000
  );
}

function TeamMark({ team }: { team: Team }) {
  return (
    <div
      className="team-mark"
      style={{
        backgroundColor: team.color,
        color: team.text_color,
      }}
    >
      {team.name.slice(0, 1)}
    </div>
  );
}

function GameCard({ game, past }: { game: Game; past?: boolean }) {
  const live = isLive(game) && !past;
  const date = new Date(game.start_at_brazil);

  return (
    <article className={`game-card ${live ? "game-card-live" : ""}`}>
      {live && (
        <div className="live-ribbon">
          <span className="live-dot" />
          AO VIVO AGORA
        </div>
      )}

      <div className="game-meta">
        <span>
          {past ? <CheckCircle2 size={15} /> : <CalendarDays size={15} />}

          {past
            ? "Jogo encerrado"
            : live
              ? "Em andamento"
              : date
                  .toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                  })
                  .replace(".", "")}
        </span>

        <span>Rodada {game.round}</span>
      </div>

      <div className="matchup">
        <div className="team">
          <TeamMark team={game.home_team} />
          <strong>{game.home_team.name}</strong>
        </div>

        <div className={`score ${live ? "score-live" : ""}`}>
          {past ? (
            `${game.home_score} × ${game.away_score}`
          ) : live ? (
            <span>Em andamento</span>
          ) : (
            <>
              <Clock3 size={17} />

              <span>
                {date.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </>
          )}
        </div>

        <div className="team team-away">
          <strong>{game.away_team.name}</strong>
          <TeamMark team={game.away_team} />
        </div>
      </div>

      {live && (
        <a
          href="https://neuhof-backend.onrender.com/live"
          style={{
            display: "block",
            padding: "30px",
            background: "red",
            color: "white",
            position: "relative",
            zIndex: 9999,
          }}
        >
          TESTE LIVE
        </a>
      )}
    </article>
  );
}

export default function Page() {
  const {
    data: apiGames,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["games"],
    queryFn: getGames,
    enabled: SHOW_GAMES,
  });

  const [germanyTime, setGermanyTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setGermanyTime(
        new Intl.DateTimeFormat("pt-BR", {
          timeZone: "Europe/Berlin",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    };

    updateTime();

    const timer = window.setInterval(updateTime, 30000);

    return () => window.clearInterval(timer);
  }, []);

  const games = apiGames ?? sampleGames;

  const upcoming = useMemo(
    () =>
      games
        .filter((game) => game.home_score === null)
        .sort(
          (a, b) => +new Date(a.start_at_brazil) - +new Date(b.start_at_brazil),
        ),
    [games],
  );

  const past = useMemo(
    () =>
      games
        .filter((game) => game.home_score !== null)
        .sort(
          (a, b) => +new Date(b.start_at_brazil) - +new Date(a.start_at_brazil),
        ),
    [games],
  );

  /**
   * When games are disabled, the application is being used
   * exclusively as a live-stream landing page.
   */
  const live = SHOW_GAMES ? upcoming.some((game) => isLive(game)) : true;

  return (
    <main>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="/">
            <span className="crest">
              <Shield size={25} />
            </span>

            <span>
              <b>SV NEUHOF</b>
              <small>Futebol ao vivo</small>
            </span>
          </a>

          <div className="country-note">
            <span className="germany-clock">
              <Clock3 size={15} />
              Alemanha <strong>{germanyTime || "--:--"}</strong>
            </span>

            <span className="time-difference">Horário local</span>
          </div>
        </div>
      </header>

      <section className={`hero ${live ? "hero-live-state" : ""}`}>
        <div className="hero-inner">
          <div className="eyebrow">
            <Trophy size={17} />
            TORÇA PELO MATHEUS
          </div>

          <h1>
            {live ? (
              <>
                O jogo está <em>acontecendo!</em>
              </>
            ) : (
              <>
                Seu time em campo.
                <br />
                <em>Você sempre por perto.</em>
              </>
            )}
          </h1>

          <p>
            {live
              ? "A partida está acontecendo agora. Clique no botão abaixo para assistir."
              : "Veja quando o SV Neuhof joga e encontre o acesso para assistir sem complicação."}
          </p>

          {live ? (
            <a
              href="https://neuhof-backend.onrender.com/live"
              className="hero-live"
            >
              <span className="live-dot" />
              ASSISTIR AO JOGO AGORA
              <ArrowRight size={21} />
            </a>
          ) : (
            <div className="next-note">
              <CalendarDays size={20} />
              <span>Próximo jogo em destaque abaixo</span>
            </div>
          )}
        </div>
      </section>

      {SHOW_GAMES && (
        <div className="content">
          <section>
            <div className="section-heading">
              <div>
                <span className="section-kicker">AGENDA</span>

                <h2>Próximos jogos</h2>
              </div>

              <span className="local-time">
                {isLoading
                  ? "Carregando jogos..."
                  : isError
                    ? "Exibindo agenda salva"
                    : "Horários de Brasília"}
              </span>
            </div>

            <div className="game-list">
              {upcoming.slice(0, 5).map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </section>

          <section className="past-section">
            <div className="section-heading">
              <div>
                <span className="section-kicker">RESULTADOS</span>

                <h2>Últimos jogos</h2>
              </div>
            </div>

            <div className="game-list">
              {past.slice(0, 4).map((game) => (
                <GameCard key={game.id} game={game} past />
              ))}
            </div>
          </section>
        </div>
      )}

      <footer>
        <span className="crest small">
          <Shield size={17} />
        </span>

        <span>SV Neuhof</span>

        <span className="footer-sep">•</span>

        <span>Para torcedores, onde estiverem</span>

        <a href="/live">
          Acessar transmissão
          <ExternalLink size={14} />
        </a>
      </footer>
    </main>
  );
}
