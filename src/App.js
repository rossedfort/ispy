/* global chrome */
import React, { Component } from 'react';
import { TabInfo } from './TabInfo';
import { LocalStorageEntry } from './LocalStorageEntry';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: {},
      localStorageEntries: [],
    };
  }

  componentDidMount() {
    console.log('initializing... requesting active tab');
    chrome.tabs.query({ active: true, currentWindow: true }, ([ activeTab ]) => {
      console.log('got tab: ', activeTab);
      this.setState({ tab: activeTab });
      this.requestTabData(activeTab);
    });
  }

  requestTabData(activeTab) {
    console.log(`requesting data from tab: ${activeTab.id}`);
    chrome.tabs.sendMessage(activeTab.id, { action: 'iSpy.requestData' }, (response) => {
      console.log(`got data: ${response.data}`);
      this.setState({ localStorageEntries: this.format(response.data) });
    });
  }

  format(localStorageEntries) {
    const parsed = JSON.parse(localStorageEntries);
    return Object.keys(parsed).reduce((entries, key) => {
      const value = parsed[key];
      return entries.concat({ key, value });
    }, []);
  }

  render() {
    const { tab, localStorageEntries } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h2>iSpy - a localStorage manager</h2>
        </header>
        <TabInfo tab={tab} />
        {
          localStorageEntries.length > 0 && <div className="local-storage-entries">
            {
              localStorageEntries.map((entry) => (
                <LocalStorageEntry key={entry.key} entry={entry} />
              ))
            }
          </div>
        }
        <footer className="App-footer">
          <small>Made with <span role="img" aria-label="purple heart emoji">💜</span> by <a href="https://rossedfort.com" target="_blank" rel="noopener noreferrer">Ross Edfort</a></small>
        </footer>
      </div>
    );
  }
}

export default App;