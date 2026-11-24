
import { mkdir, writeFile } from 'node:fs/promises';

const baseUrl =
  'https://raw.githubusercontent.com/rabbitmq/rabbitmq-tutorials/main';

const tutorials = {
  tutorial2: {
    sourcePath: 'python',
    files: ['new_task.py', 'worker.py'],
  },

  tutorial3: {
    sourcePath: 'python',
    files: ['receive_logs.py', 'emit_log.py'],
  },
};

for (const [tutorial, config] of Object.entries(tutorials)) {
  // Create the output directory for this tutorial.
  const outputDir = new URL(`../generated/${tutorial}/`, import.meta.url);

  await mkdir(outputDir, { recursive: true });

  // Fetch each source file from the official RabbitMQ tutorials repository.
  for (const file of config.files) {
    const url = `${baseUrl}/${config.sourcePath}/${file}`;

    console.log(`Fetching ${tutorial}/${file}...`);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${tutorial}/${file}: HTTP ${response.status}`
      );
    }

    const source = await response.text();

    // Save the downloaded source without changing its filename or content.
    await writeFile(new URL(file, outputDir), source, 'utf8');

    console.log(`Saved ${tutorial}/${file}`);
  }
}

console.log('Tutorial source files fetched successfully.');
