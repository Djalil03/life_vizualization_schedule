import { type JSX } from "react";
import { useSearchParams } from 'react-router-dom';
import LifeVisKonva from "@/modules/LifeVisKonva/ui/LifeVisKonva";
import LifeVisJs from "@/modules/LifeVisJs/ui/LifeVisJs";
import'./App.scss'

type Variant = 'Konva' | 'VisJs'

const view: Record<Variant, JSX.Element> = {
  'Konva': <LifeVisKonva />,
  'VisJs': <LifeVisJs />
}

function App() {
  const [searchParams, setSearchParams] = useSearchParams()
  const variant = searchParams.get('variant') || 'Konva'

  const handleChange = (newValue: Variant) => {
    setSearchParams({ variant: newValue });
  };

  return (
    <div className='app'>
      <h1>Визуализация жизненного графика</h1>
      <div>
        {Object.keys(view).map((viewVariant) => (
          <button 
            key={viewVariant}
            onClick={() => handleChange(viewVariant as Variant)}
          >
            {viewVariant}
          </button>
        ))}
      </div>
      { view[variant as Variant] || view['Konva'] }
    </div>
  )
}

export default App
