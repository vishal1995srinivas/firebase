import React, { Component } from 'react';
import firebase from '../firebase';
import Corousel from './Corousel';

class Display extends Component {
	constructor(props) {
		super(props);
		this.addHistory = this.addHistory.bind(this);
		this.addCollection = this.addCollection.bind(this);
		this.ResetHistory = this.ResetHistory.bind(this);
		this.removeSpecificCollection = this.removeSpecificCollection.bind(this);
		this.resetCollection = this.resetCollection.bind(this);
		this.getDataToState = this.getDataToState.bind(this);
		this.state = {
			history: [],
			collections: null
		};
	}
	async addHistory(Historydata) {
		//working good
		//let id = Date.now();
		//let Historydata = { id: id, method: "GET", url: "www.google.com" };
		const db = firebase.firestore();
		const historyRef = await db.collection('history').add(Historydata);
		console.log(historyRef);
		this.setState({
			history: Historydata
		});
	}
	async addCollection(newCollection) {
		//newcolelction as param
		const db = firebase.firestore();
		const collectionRef = await db.collection('collections').add(newCollection);
		console.log(collectionRef);
	}
	async addRequestToCollection(collectionName) {
		//add newRequest a param
		let id = Date.now();
		let newRequest = {
			id: id,
			title: 'Sample',
			url: 'www.google.com',
			method: 'GET'
		};
		const db = firebase.firestore();
		const RequestRef = await db
			.collection('collections')
			.where('name', '==', collectionName)
			.get()
			.then((snapshot) => {
				if (snapshot.empty) {
					console.log('No matching documents.');
					return;
				}
				snapshot.forEach((doc) => {
					console.log(doc.id);
					let updateRef = db.collection('collections').doc(`${doc.id}`);
					let elementRef = updateRef.update({
						requests: firebase.firestore.FieldValue.arrayUnion(newRequest)
					});
				});
			})
			.catch((err) => {
				console.log('Error getting documents', err);
			});
		// console.log(RequestRef);
	}
	async ResetHistory() {
		const db = firebase.firestore();
		const RequestRef = await db
			.collection('history')
			.get()
			.then((snapshot) => {
				if (snapshot.empty) {
					console.log('No matching documents.');
					return;
				}
				snapshot.forEach((doc) => {
					console.log(doc.id);
					let deleteDoc = db.collection('history').doc(`${doc.id}`).delete();
				});
			})
			.catch((err) => {
				console.log('Error getting documents', err);
			});
	}
	async removeSpecificCollection(collectionName) {
		const db = firebase.firestore();
		const RequestRef = await db
			.collection('collections')
			.where('name', '==', collectionName)
			.get()
			.then((snapshot) => {
				if (snapshot.empty) {
					console.log('No matching documents.');
					return;
				}
				snapshot.forEach((doc) => {
					console.log(doc.id);
					let deleteDoc = db.collection('collections').doc(`${doc.id}`).delete();
				});
			})
			.catch((err) => {
				console.log('Error getting documents', err);
			});
	}
	async resetCollection() {
		const db = firebase.firestore();
		const RequestRef = await db
			.collection('collections')
			.get()
			.then((snapshot) => {
				if (snapshot.empty) {
					console.log('Collections is empty');
					return;
				}
				snapshot.forEach((doc) => {
					console.log(doc.id);
					let deleteDoc = db.collection('collections').doc(`${doc.id}`).delete();
				});
			})
			.catch((err) => {
				console.log('Error getting documents', err);
			});
	}
	async getDataToState() {
		let newHistoryState = [];
		let newCollectionsState = [];
		const db = firebase.firestore();
		let historyRef = db.collection('history');
		let collectionsRef = db.collection('collections');
		let allHistory = historyRef
			.get()
			.then((snapshot) => {
				snapshot.forEach((doc) => {
					newHistoryState.push(doc.data());
				});
				console.log(newHistoryState);
				this.setState({ history: newHistoryState });
			})
			.catch((err) => {
				console.log('Error getting documents', err);
			});

		let allCollections = collectionsRef
			.get()
			.then((snapshot) => {
				snapshot.forEach((doc) => {
					newCollectionsState.push(doc.data());
				});
				console.log(newCollectionsState);
				this.setState({ collections: newCollectionsState });
			})
			.catch((err) => {
				console.log('Error getting documents', err);
			});
	}
	render() {
		console.log('History', this.state.history);
		console.log('Collections', this.state.collections);
		return (
			<div>
				{/* <button onClick={this.addHistory}>Click to add history</button>
				<button onClick={this.addCollection}>Click to add Collection</button>
				<button
					onClick={() => {
						this.addRequestToCollection('Sample');
					}}
				>
					Click to add Request To Collection
				</button>
				<button onClick={this.ResetHistory}>Click to reset history</button>
				<button
					onClick={() => {
						this.removeSpecificCollection('Sample');
					}}
				>
					Click to remove Specific Collection
				</button>
				<button onClick={this.resetCollection}>Click to reset collection</button>
				<button onClick={this.getDataToState}>Click to get data to state</button> */}
				<div>
					<Corousel />
				</div>
			</div>
		);
	}
}

export default Display;
