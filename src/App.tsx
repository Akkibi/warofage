import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

import ThreeManager from './three/three-manager';
import UiElements from './ui-elements';
import VictoryScreen from './victory-screen';
import LoseScreen from './lose-screen';

gsap.registerPlugin(useGSAP);
const App = () => {
  return (
    <div className='overflow-hidden absolute inset-0'>
      <ThreeManager />
      <UiElements />
      <LoseScreen />
      <VictoryScreen />
    </div>
  );
};

export default App;
