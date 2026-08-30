"use client"

export default function LivePage() {
  return (
    <main>
      <a
        href="https://neuhof-backend.onrender.com/live"
        target="_self"
      >
        CONTINUAR PARA TRANSMISSÃO
      </a>

      <br />

      <button
        type="button"
        onClick={() => {
          window.location.assign(
            "https://neuhof-backend.onrender.com/live",
          );
        }}
      >
        CONTINUAR VIA JS
      </button>
    </main>
  );
}