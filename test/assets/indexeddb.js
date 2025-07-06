const DB_NAME = 'mObywatelDB';
const DB_VERSION = 1;
const STORE_NAME = 'generatedDataStore';

function openDatabase(callback) {
  const request = indexedDB.open(DB_NAME, DB_VERSION);
  request.onupgradeneeded = function(event) {
    const db = event.target.result;
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  };
  request.onsuccess = function(event) {
    callback(event.target.result);
  };
  request.onerror = function() {
    console.error("IndexedDB error");
  };
}

function saveToIndexedDB(data) {
  openDatabase(db => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.put(data);
  });
}

function getFromIndexedDB(id, callback) {
  openDatabase(db => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = function() {
      callback(request.result);
    };
  });
}
