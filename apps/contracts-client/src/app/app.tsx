import { createSignal, VoidComponent } from 'solid-js';
import cn from 'classnames';
import { withProviders } from './providers';
import styles from './app.module.css';

export const App: VoidComponent = withProviders(() => {
	const [count, setCount] = createSignal(0);

	return (
		<>
			<div>
				<a href='https://vitejs.dev' target='_blank'>
					<img class={styles.logo} alt='Vite logo' />
				</a>
				<a href='https://solidjs.com' target='_blank'>
					<img class={cn(styles.logo, styles.solid)} alt='Solid logo' />
				</a>
			</div>
			<h1>Vite + Solid</h1>
			<div class={styles.card}>
				<button onClick={() => setCount((count) => count + 1)}>
					count is {count()}
				</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p class={styles['read-the-docs']}>
				Click on the Vite and Solid logos to learn more
			</p>
		</>
	);
});
