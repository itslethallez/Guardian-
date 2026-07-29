export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-gradient-to-br from-gold to-gold/70 rounded-lg flex items-center justify-center">
        <svg
          className="w-5 h-5 text-dark"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 1C6.48 1 2 5.48 2 11v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-8c0-5.52-4.48-10-10-10zm0 2c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8zm0 2c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" />
        </svg>
      </div>
      <span className="font-semibold text-lg text-ivory hidden sm:inline">Sotto</span>
    </div>
  )
}
