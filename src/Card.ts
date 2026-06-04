import * as THREE from 'three';

export enum CardRank {
	Three,
	Four,
	Five,
	Six,
	Seven,
	Eight,
	Nine,
	Ten,
	Jack,
	Queen,
	King,
	Ace,
	Two
}

export enum CardSuite {
	Diamond,
	Club,
	Heart,
	Spade
}

export class Card {
	private static	textureLoader = new THREE.TextureLoader();
	private static	geometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(1, 1.5);
	private static	frontTextureAtlas: Array<THREE.Texture> = Card.initTextureAtlas();
	private	frontTexture: THREE.Texture;
	private	backTexture: THREE.Texture;
	private	frontMaterial: THREE.MeshBasicMaterial;
	private	backMaterial: THREE.MeshBasicMaterial;
	private	frontMesh: THREE.Mesh;
	private	backMesh: THREE.Mesh;

	public	object: THREE.Group;
	public	rank: CardRank;
	public	suite: CardSuite;

	constructor(rank: CardRank, suite: CardSuite ) {
		this.rank = rank;
		this.suite = suite;

		// Load texture based on rank and suite
		// this.frontTexture = this.getTexture(this.rank, this.suite);
		this.frontTexture = this.getFrontTexture(this.rank, this.suite);
		this.backTexture = Card.textureLoader.load('/src/resources/card_back.webp');

		this.frontMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, map: this.frontTexture, side: THREE.FrontSide });
		this.backMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, map: this.backTexture, side: THREE.BackSide });
		this.frontMesh = new THREE.Mesh(Card.geometry, this.frontMaterial);
		this.backMesh = new THREE.Mesh(Card.geometry, this.backMaterial);
		this.object = new THREE.Group();
		this.frontMesh.userData.instance = this;
		this.backMesh.userData.instance = this;
		this.object.add(this.frontMesh);
		this.object.add(this.backMesh);
	}
	
	public static pushCards(cardsA: Array<Card>, cardsB: Array<Card>)
	{
		cardsA.forEach((card: Card) => {
			cardsB.push(card);
			cardsA.splice(cardsA.indexOf(card), 1);
		});
	}

	public static getCardObjects(cards: Array<Card>)
	{
		let cardObjects: Array<THREE.Object3D> = [];
		for (let i = 0; i < cards.length; i++) {
			cardObjects.push(cards[i].object);
		}
		return (cardObjects);
	}

	private static initTextureAtlas(): Array<THREE.Texture>
	{
		const textureAtlas: Array<THREE.Texture> = [];
		const textureAtlasPath: string = '/src/resources/cardTextures.png';
		const cols: number = 13;
		const rows: number = 4;
		// Index starts from bottom-left and goes right(x) and up(y)
		for (let y: number = 0; y < rows; y++) {
			for (let x: number = 0; x < cols; x++) {
				let texture = Card.textureLoader.load(textureAtlasPath);
				texture.wrapS = THREE.ClampToEdgeWrapping;
				texture.wrapT = THREE.ClampToEdgeWrapping;
				texture.minFilter = THREE.NearestFilter;
				texture.magFilter = THREE.NearestFilter;
				texture.generateMipmaps = false;
				texture.repeat.set(1 / cols, 1 / rows);
				texture.offset.set(x / cols, y / rows);
				textureAtlas.push(texture);
			}
		}
		return (textureAtlas);
	}

	private getFrontTexture(rank: CardRank, suite: CardSuite): THREE.Texture {
		let texture: THREE.Texture = this.backTexture; // replace with ? front texture
		const col = 13;
		let y: number = 0;
		switch (suite) {
			case CardSuite.Spade: y = 0; break ;
			case CardSuite.Heart: y = 3; break ;
			case CardSuite.Club: y = 2; break ;
			case CardSuite.Diamond: y = 1; break ;
		}
		switch (rank) {
			case CardRank.Two: texture = Card.frontTextureAtlas[y * col + 0]; break ;
			case CardRank.Three: texture = Card.frontTextureAtlas[y * col + 1]; break ;
			case CardRank.Four: texture = Card.frontTextureAtlas[y * col + 2]; break ;
			case CardRank.Five: texture = Card.frontTextureAtlas[y * col + 3]; break ;
			case CardRank.Six: texture = Card.frontTextureAtlas[y * col + 4]; break ;
			case CardRank.Seven: texture = Card.frontTextureAtlas[y * col + 5]; break ;
			case CardRank.Eight: texture = Card.frontTextureAtlas[y * col + 6]; break ;
			case CardRank.Nine: texture = Card.frontTextureAtlas[y * col + 7]; break ;
			case CardRank.Ten: texture = Card.frontTextureAtlas[y * col + 8]; break ;
			case CardRank.Jack: texture = Card.frontTextureAtlas[y * col + 9]; break ;
			case CardRank.Queen: texture = Card.frontTextureAtlas[y * col + 10]; break ;
			case CardRank.King: texture = Card.frontTextureAtlas[y * col + 11]; break ;
			case CardRank.Ace: texture = Card.frontTextureAtlas[y * col + 12]; break ;
		}
		return (texture);
	}
}