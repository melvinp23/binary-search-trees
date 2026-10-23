class Node {
	constructor(data) {
		this.data = data;
		this.left = null;
		this.right = null;
	}
}

class Tree {
	constructor(array) {
		this.root = this.#buildTree(array);
	}

	#buildTree(array) {
		const sortedUniqueArray = Array.from(new Set(array)).sort((a, b) => a - b);
		const recursiveBuild = (arr, start, end) => {
			if (start > end) return null;

			const mid = Math.floor((start + end) / 2);
			const node = new Node(arr[mid]);

			node.left = recursiveBuild(arr, start, mid - 1);
			node.right = recursiveBuild(arr, mid + 1, end);

			return node;
		};

		return recursiveBuild(sortedUniqueArray, 0, sortedUniqueArray.length - 1);
	}

	#findNode(value, node = this.root) {
		if (node === null) return null;
		if (node.data === value) return node;

		if (value < node.data) {
			return this.#findNode(value, node.left);
		} else {
			return this.#findNode(value, node.right);
		}
	}

	includes(value) {
		return this.#findNode(value) !== null;
	}

	insert(value, node = this.root) {
		if (this.root === null) {
			this.root = new Node(value);
			return;
		}

		if (value === node.data) return;

		if (value < node.data) {
			if (node.left === null) {
				node.left = new Node(value);
			}
		}
	}
}
