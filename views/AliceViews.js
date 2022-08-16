import React from 'react';

export class SetWager extends React.Component {
  render() {
    const {parent, defaultWager} = this.props;
    const {req} = this.state || {};
    return (
      <div className='hcenter' style={{flexFlow:"column"}}>
        Set wager for new game!
        <br />
        <input
          type='number'
          onChange={(e) => this.setState({req: e.currentTarget.value})}
          placeholder={defaultWager}
        />
        <br />
        <button
        onClick={() => parent.setWager(req || defaultWager)}
        >
Start game
        </button>
      </div>
    );
  }
}

export class BackendRunning extends React.Component {
  async copyToClipboard() {
    const {ctcInfoStr} = this.props;
    navigator.clipboard.writeText(ctcInfoStr);
  }

  render() {
    let copyText='Copy to clipboard!';
    let disabled=false;
    const {ctcInfoStr} = this.props;
    if (ctcInfoStr === undefined) {
      return (
        <div>
          Waiting for the contract to be deployed...
          If this takes more than 1 min, something may be wrong.
        </div>
      )
    } else {
      return (
        <>
          <h2>Contract Info</h2>
          Give Bob the following contract information...

          <p className='ContractInfo'>
            {ctcInfoStr}
          </p>
          <br />
          <button
          disabled={disabled}
            onClick={async (e) => {
              copyText='Copied!'
              disabled=true;
            this.copyToClipboard()}
            }
          >{copyText}</button>
          <br />
        </>
      );
    }
  }
}

export class AliceWrapper extends React.Component {
  render() {
    const {alice, ctcInfoStr} = this.props;
    return (
      <div className="Alice flex-grid" style={{width:"40%", flexFlow:'column'}}>
        {ctcInfoStr}
        {alice}
        </div>
    );
  }
}