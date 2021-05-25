import chalk from 'chalk';
import moment from 'moment';
import util from 'util';

export default class Logger {
	log(content, { color = 'grey', tag = 'Log' } = {}) {
		this.write(content, { color, tag });
	}

	info(content, { color = 'green', tag = 'Info' } = {}) {
		this.write(content, { color, tag });
	}

	warn(content, { color = 'yellow', tag = 'Warn' } = {}) {
		this.write(content, { color, tag });
	}

	error(content, { color = 'red', tag = 'Error' } = {}) {
		this.write(content, { color, tag, error: true });
	}

	stacktrace(content, { color = 'white', tag = 'Error' } = {}) {
		this.write(content, { color, tag, error: true });
	}

	write(content, { color = 'grey', tag = 'Log', error = false } = {}) {
		const timestamp = chalk.cyan(
			`[${moment().format('YYYY-MM-DD HH:mm:ss')}]:`
		);
		const levelTag = chalk.bold(`[${tag}]:`);
		const text = chalk[color](this.clean(content));
		const stream = error ? process.stderr : process.stdout;
		stream.write(`${timestamp} ${levelTag} ${text}\n`);
	}

	clean(item) {
		if (typeof item === 'string') return item;
		const cleaned = util.inspect(item, { depth: Infinity });
		return cleaned;
	}
}
