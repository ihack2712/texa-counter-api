// Imports
import {
	resolve,
	join,
	dirname,
	exists
} from "./deps.ts";

const KEY_DIR: string = resolve(Deno.cwd(), ".data/");
const VDIR: string = resolve(KEY_DIR, "v");
const UDIR: string = resolve(KEY_DIR, "u");

const visitor = (key: string): string => join(VDIR, key);
const unique = (key: string): string => join(UDIR, key);
const uvisitor = (key: string, id: string) => join(unique(key), "v", id);
const uvisitors = (key: string) => join(unique(key), "visitors");

// Constant big integers.
const big0 = 0n;
const big8 = 8n;
const big255 = 255n;

/**
 * Turn a binary array into a big integer.
 * @param arr The binary array.
 */
function arr_to_bigint (arr: Uint8Array)
{
	return (arr as Uint8Array).reduce((prev, n, i) => prev | ( BigInt(n) << ( BigInt(i) * big8 ) ), BigInt(0));
}

/**
 * Turn a binary array into a number.
 * @param arr The binary array.
 */
function arr_to_num (arr: Uint8Array): number
{
	return Number(arr_to_bigint(arr));
}

/**
 * Turn any integer into a byte array.
 * @param n The big integer.
 */
function num_to_arr (n: bigint | number | string): Uint8Array
{
	const arr: number[] = [];
	if (typeof n !== "bigint") n = BigInt(n);
	if (n < 0) n =- n;
	while (n > big0)
	{
		const byte = n & big255;
		n = n >> big8;
		arr.push(Number(byte));
	}
	if (arr[arr.length - 1] === 0) arr.shift();
	return new Uint8Array(arr);
}

async function getVisitorsOf (path: string): Promise<number>
{
	try
	{
		const arr = await Deno.readFile(path);
		const num = arr_to_num(arr);
		return num;
	} catch (error)
	{
		if (error instanceof Deno.errors.NotFound) return 0;
		throw error;
	}
}

async function setVisitorsOf (path: string, visitors: string | number | bigint)
{
	const dir = dirname(path);
	if (!await exists(dir)) await Deno.mkdir(dir, { recursive: true });
	await Deno.writeFile(path, num_to_arr(visitors));
}

/**
 * Get the amount of visitors on a key.
 * @param key The key name.
 */
export async function getVisitors (key: string): Promise<number>
{
	return await getVisitorsOf(visitor(key));
}

/**
 * Set the amount of visitors on a key.
 * @param key The key name.
 * @param visitors The amount of visitors.
 */
export async function setVisitors (key: string, visitors: string | number | bigint)
{
	await setVisitorsOf(visitor(key), visitors);
}

/**
 * Get the current amount of visitors of a key, and increment the
 * number.
 * @param key The key name.
 */
export async function visit (key: string): Promise<number>
{
	const num = await getVisitors(key);
	await setVisitors(key, num + 1);
	return num;
}

/**
 * Get the amount of visitors on a key.
 * @param key The key name.
 */
export async function getUniqueVisitors (key: string): Promise<number>
{
	return await getVisitorsOf(uvisitors(key));
}

/**
 * Set the amount of unique visitors.
 * @param key The key name.
 * @param visitors The amount of visitors.
 */
async function setUniqueVisitors (key: string, visitors: string | number | bigint)
{
	await setVisitorsOf(uvisitors(key), visitors);
}

async function addUniqueVisitor (key: string, visitorHash: string)
{
	await setVisitorsOf(uvisitor(key, visitorHash), 0);
}

async function hasUniqueVisitor (key: string, visitorHash: string)
{
	return await exists(uvisitor(key, visitorHash));
}

/**
 * get the current amount of unique visitors of a key, and increment
 * the number.
 * @param key The key name.
 * @param visitorHash The hash of the unique visitor.
 */
export async function uniqueVisit (key: string, visitorHash: string): Promise<number>
{
	const num = await getUniqueVisitors(key);
	if (!await hasUniqueVisitor(key, visitorHash))
	{
		await addUniqueVisitor(key, visitorHash);
		await setUniqueVisitors(key, num + 1);
	}
	return num;
}
