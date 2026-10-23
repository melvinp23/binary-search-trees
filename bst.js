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
			} else {
				this.insert(value, node.left);
			}
		} else {
			if (node.right === null) {
				node.right = new Node(value);
			} else {
				this.insert(value, node.right);
			}
		}
	}

	deleteItem(value, node = this.root) {
		const deleteNode = (currentNode, val) => {
			if (currentNode === null) return null;

			if (val < currentNode.data) {
				currentNode.left = deleteNode(currentNode.left, val);
			} else if (val > currentNode.data) {
				currentNode.right = deleteNode(currentNode.right, val);
			} else {
				if (currentNode.left === null) return currentNode.right;
				if (currentNode.right === null) return currentNode.left;

				let successor = currentNode.right;
				while (successor.left !== null) {
					successor = successor.left;
				}

				currentNode.data = successor.data;

				currentNode.right = deleteNode(currentNode.right, successor.data);
			}

			return currentNode;
		};

		node = deleteNode(this.root, value);
	}

	levelOrderForEach(callback) {
		if (typeof callback !== 'function') {
			throw new Error('Callback function is required');
		}

		if (this.root === null) return;

		const queue = [this.root];

		while (queue.length > 0) {
			const currentNode = queue.shift();
			callback(currentNode.data);

			if (currentNode.left !== null) queue.push(currentNode.left);
			if (currentNode.right !== null) queue.push(currentNode.right);
		}
	}

	inOrderForEach(callback, node = this.root) {
		if (typeof callback !== 'function') {
			throw new Error('Callback function is required');
		}

		if (node === null) return;

		this.inOrderForEach(callback, node.left);
		callback(node.data);
		this.inOrderForEach(callback, node.right);
	}

	preOrderForEach(callback, node = this.root) {
		if (typeof callback !== 'function') {
			throw new Error('Callback function is required');
		}

		if (node == null) return;

		callback(node.data);
		this.inOrderForEach(callback, node.left);
		this.inOrderForEach(callback, node.right);
	}

	postOrderForEach(callback, node = this.root) {
		if (typeof callback !== 'function') {
			throw new Error('Callback function is required');
		}

		if (node === null) return;

		this.inOrderForEach(callback, node.left);
		this.inOrderForEach(callback, node.right);
		callback(node.data);
	}

	height(value) {
		const targetNode = this.#findNode(value);
		if (!targetNode) return undefined;

		const getHeight = node => {
			if (node === null) return -1;
			const leftHeight = getHeight(node.left);
			const rightHeight = getHeight(node.right);
			return Math.max(leftHeight, rightHeight) + 1;
		};

		return getHeight(targetNode);
	}

	depth(value) {
		let currentDepth = 0;
		let currentNode = this.root;

		while (currentNode !== null) {
			if (currentNode.data === value) return currentDepth;

			if (value < currentNode.data) {
				currentNode = currentNode.left;
			} else {
				currentNode = currentNode.right;
			}
			currentDepth++;
		}

		return undefined;
	}

	isBalanced() {
		const checkBalance = node => {
			if (node === null) return { height: -1, isBalanced: true };

			const left = checkBalance(node.left);
			const right = checkBalance(node.right);

			const isSubtreeBalanced =
				left.isBalanced &&
				right.isBalanced &&
				Math.abs(left.height - right.height) <= 1;

			const currentHeight = Math.max(left.height, right.height) + 1;

			return { height: currentHeight, isBalanced: isSubtreeBalanced };
		};

		return checkBalance(this.root).isBalanced;
	}

	rebalance() {
		const values = [];
		this.inOrderForEach(val => values.push(val));
		this.root = this.#buildTree(values);
	}
}
