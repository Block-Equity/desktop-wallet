import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './style.css'

import isEmpty from 'lodash/isEmpty'
import numeral from 'numeral'

import { CircularProgress } from 'material-ui/Progress'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ListGroup,
  ListGroupItem
}
from 'reactstrap'

import Slide from 'material-ui/transitions/Slide'

import {
  ListSubheader
} from 'material-ui/List'

import {
  MenuList
} from 'material-ui/Menu'

import AddAsset from '../../Shared/AddAsset'

import {
  fetchAccountDetails,
  setCurrentAccount,
  fetchSupportedAssets,
  fetchStellarAssetsForDisplay,
  fetchBlockEQTokensForDisplay,
  changeTrustOperation
} from '../../../common/account/actions'

import {
  getAccounts,
  getCurrentAccount,
  getSupportedStellarAssets,
  getStellarAssetsForDisplay,
  getBlockEQTokensForDisplay
} from '../../../common/account/selectors'

import {
  streamPayments
} from '../../../common/payment/actions'

import {
  getIncomingPayment
} from '../../../common/payment/selectors'

const font = "'Lato', sans-serif"

const listSections = {
   wallet: { displayName: 'WALLET' },
   supported_assets: { displayName: 'SUPPORTED ASSETS' }
}

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class AccountList extends Component {

  constructor (props) {
    super()
    this.state = ({
      assetSelected: 0,
      changeTrustInProcess: false,
      changeTrustAsset: undefined,
      showAddAssetModal: false,
      processingAddAsset: false
    })
    this.handleBlockEQTokenAddition = this.handleBlockEQTokenAddition.bind(this)
    this.toggleAddAssetModal = this.toggleAddAssetModal.bind(this)
    this.handleAddAssetSubmission = this.handleAddAssetSubmission.bind(this)
  }

  componentDidMount () {
    this.loadAccounts()
  }

  async loadAccounts () {
    try {
      const { accounts } = this.props
      if (!isEmpty(accounts)) {
        await this.props.fetchAccountDetails()
        if (this.props.userAccountDetailFailed) {
          await this.props.fetchSupportedAssets()
          await this.props.fetchStellarAssetsForDisplay()
          await this.props.fetchBlockEQTokensForDisplay()
        }
      }
    } catch (e) {
      console.log(e)
      // TODO: display something on the UI
    }
  }

  render() {
    return (
      <div>
        <div style={{ width: '9.5rem', marginTop: '-0.55rem', backgroundColor: '#FFFFFF', borderRight: '1px solid rgba(0, 0, 0, 0.06)', height: '40.5rem'}}>
          <MenuList style={{ height: '100vh' }}>
            <ListGroup id={styles.listItem}>
              { this.renderAssets() }
            </ListGroup>
            { (!isEmpty(this.props.blockEQTokens)) && this.renderSubHeader(listSections.supported_assets.displayName)}
            { this.renderSupportedAssets() }
            <ListGroup>
              { this.renderAddAsset() }
            </ListGroup>
          </MenuList>
        </div>
        { this.renderLoadingDialog() }
        <AddAsset showModal={ this.state.showAddAssetModal }
                  addAssetSuccessful={ this.handleAddAssetSubmission }
                  toggle={ this.toggleAddAssetModal } />
      </div>
    )
  }

  renderAssets() {
    if (this.props.assets) {
      const listItemStyleNormal = {outline: 'none', borderRadius: '0', borderColor: 'rgba(0, 0, 0, 0.06)', borderRight: '0', borderLeft: '0' }
      const listItemStyleActive = { ...listItemStyleNormal, backgroundColor: '#FAFAFA', color: '#002EC4' }

      return this.props.assets.map((asset, index) => {
        const selected = this.state.assetSelected === index ? true : false
        return (
          <ListGroupItem
            key = { index }
            style={ selected ? listItemStyleActive : listItemStyleNormal }
            active={ selected }
            tag='button'
            onClick={ this.handleStellarAssetSelection(asset, index) } action>
            {this.renderAccountListLabel(asset, selected)}
          </ListGroupItem>
        )
      })
    }
  }

  renderSupportedAssets() {
    const listItemStyleNormal = {outline: 'none', borderRadius: '0', borderColor: 'rgba(0, 0, 0, 0.06)', borderRight: '0', borderLeft: '0' }

    if (this.props.blockEQTokens) {
      return this.props.blockEQTokens.map((asset, index) => {
        return (
          <ListGroupItem
            key={ index }
            style={ listItemStyleNormal }
            onClick={this.handleBlockEQTokenAddition(asset, index)}
            action>
            {this.renderSupportedAssetListLabel(asset.asset_name)}
          </ListGroupItem>
        )
      })
    }
  }

  renderAddAsset () {
    const listItemStyleNormal = {fontSize: '0.75rem', outline: 'none', borderRadius: '0', borderColor: 'rgba(0, 0, 0, 0.00)' }

    return (
      <ListGroupItem
        style={ listItemStyleNormal }
        onClick={ this.toggleAddAssetModal } action>
          <i className='fa fa-plus-circle' style={{marginRight: '0.5rem', color: 'rgb(0, 0, 0, 0.25)'}}/>
          Add Asset
      </ListGroupItem>
    )
  }

  renderSubHeader (value) {
    return (
      <ListSubheader style={{fontFamily: font, outline: 'none', marginTop: '-0.3rem', marginBottom: '-0.32rem', fontSize: '0.6rem', fontWeight: '700', letterSpacing: '0.04rem' }} component="div">
        {value}
      </ListSubheader>
    )
  }

  renderAccountListLabel (asset, isActive) {

    const imageView = (
      <div className={styles.assetContainerImage}>
        <img alt='' src={ asset.asset_image } height='21px' width='21px'/>
      </div>
    )

    const labelView = (
      <label style={{fontSize: '0.75rem', marginBottom: '0rem'}}>
        { asset.asset_name }
      </label>
    )

    const minBalance = asset.balance - (asset.minimumBalance ? asset.minimumBalance.minimumBalanceAmount : 0)
    const balance = asset.asset_code === 'XLM' ? (minBalance > 0 ? minBalance : 0): asset.balance

    const balanceView = (
      <label style={{fontSize: '0.65rem', marginBottom: '0rem'}}>
        {`${numeral(balance).format('0,0.00')} (${ asset.asset_code })`}
      </label>
    )

    return (
      <div className={styles.assetContainer}>
        { imageView }
        <div className={styles.assetLabelContainer}>
          { labelView }
          { balanceView }
        </div>
      </div>
    )
  }

  renderSupportedAssetListLabel (value) {
    return (
      <label style={{fontFamily: font, fontSize: '0.85rem', paddingTop: '0.4rem'}}>
        {value}
      </label>
    )
  }

  renderLoadingDialog () {
    return (
      <Modal isOpen={this.state.changeTrustInProcess} className={this.props.className} centered={true}>
        <ModalHeader style={{boxShadow: 'none'}}>Please wait...</ModalHeader>
        <ModalBody>
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <CircularProgress style={{ color: '#000000', marginRight: '0.75rem', paddingTop: '0.1rem' }} thickness={ 5 } size={ 15 } />
            Adding BlockEQ Token
          </div>
        </ModalBody>
      </Modal>
    )
  }

  handleStellarAssetSelection = (asset, index) => event => {
    event.preventDefault()
    this.setState({
      assetSelected: index
    })
    this.props.setCurrentAccount(asset)
  }

  handleBlockEQTokenAddition = (asset, index) => event => {
    event.preventDefault()
    this.setState({
      changeTrustInProcess: true,
      changeTrustIndex: asset
    })
    this.changeTrust (asset)
  }

  toggleAddAssetModal () {
    this.setState({
      showAddAssetModal: !this.state.showAddAssetModal
    })
  }

  handleAddAssetSubmission () {
    this.setState({
      showAddAssetModal: false
    })
  }

  async changeTrust (asset) {
    await this.props.changeTrustOperation(asset, false)
    await this.refreshAccounts()
    this.setState({ changeTrustInProcess: false })
  }

  async refreshAccounts () {
    await this.props.fetchAccountDetails()
    await this.props.fetchStellarAssetsForDisplay()
    await this.props.fetchBlockEQTokensForDisplay()
  }
}

const mapStateToProps = (state) => {
  return {
    accounts: getAccounts(state),
    currentAccount: getCurrentAccount(state),
    supportedStellarAccounts: getSupportedStellarAssets(state),
    userAccountDetailFailed: state.account.fetchingFailed,
    incomingPayment: getIncomingPayment(state),
    assets: getStellarAssetsForDisplay(state),
    blockEQTokens: getBlockEQTokensForDisplay(state)
  }
}

export default connect(mapStateToProps, {
  fetchAccountDetails,
  setCurrentAccount,
  fetchSupportedAssets,
  streamPayments,
  fetchStellarAssetsForDisplay,
  fetchBlockEQTokensForDisplay,
  changeTrustOperation
})(AccountList)