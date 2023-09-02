/* @refresh reload */
import { createRoot } from 'react-dom/client';

import { App } from './app';
import { appModel } from './shared/models';

const container = document.getElementById('root');
const root = createRoot(container!);

appModel.started();

root.render(<App />);
