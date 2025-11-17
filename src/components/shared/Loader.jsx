export default function Loader({text = 'Loading...'}) {
  return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center">
        <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
        <p className="text-state-disabled">{text}</p>
      </div>
    </div>
  )
}
