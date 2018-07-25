import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './style.css'

import isEmpty from 'lodash/isEmpty'
import numeral from 'numeral'

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ListGroup,
  ListGroupItem,
  FormText
}
from 'reactstrap'

import {
  ListSubheader
} from 'material-ui/List'

import {
  MenuList
} from 'material-ui/Menu'

import AddAsset from '../../Shared/AddAsset'
import ActionButton from '../../Shared/ActionButton'
import Alert from '../../Shared/Alert'

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

class AccountList extends Component {

  constructor (props) {
    super()
    this.state = ({
      assetSelected: 0,
      changeTrustInProcess: false,
      changeTrustAsset: undefined,
      showAddAssetModal: false,
      showAddSupportedAssetModal: false,
      alertOpen: false,
      alertMessage: '',
      alertSuccess: false
    })
    this.handleBlockEQTokenAddition = this.handleBlockEQTokenAddition.bind(this)
    this.toggleAddAssetModal = this.toggleAddAssetModal.bind(this)
    this.toggleAddSupportedAssetModal = this.toggleAddSupportedAssetModal.bind(this)
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
        <div style={{ width: '9.5rem', marginTop: '-0.55rem', backgroundColor: '#FFFFFF', borderRight: '1px solid rgba(0, 0, 0, 0.06)', height: '40.5rem', overflowY: 'scroll'}}>
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
        <Alert
          open={this.state.alertOpen}
          message={this.state.alertMessage}
          success={this.state.alertSuccess}
          close={() => { this.setState({ alertOpen: false })}}
        />
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
        <img alt='' src={ asset.asset_image } height='26px' width='26px'/>
      </div>
    )

    const labelView = (
      <label style={{fontSize: '0.7rem', marginBottom: '0rem'}}>
        <b>{ asset.asset_name }</b>
      </label>
    )

    const minBalance = asset.balance - (asset.minimumBalance ? asset.minimumBalance.minimumBalanceAmount : 0)
    const balance = asset.asset_code === 'XLM' ? (minBalance > 0 ? minBalance : 0): asset.balance

    const balanceView = (
      <label style={{fontSize: '0.6rem', marginBottom: '0rem'}}>
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
    const btnTitle = {
      default: 'Add Asset',
      processing: 'Adding asset...'
    }
    return (
      <Modal isOpen={this.state.showAddSupportedAssetModal} className={this.props.className} centered={true}>
        <ModalHeader
          style={{boxShadow: 'none'}}
          toggle={this.toggleAddSupportedAssetModal}>
            {this.state.changeTrustAsset ? `Add ${this.state.changeTrustAsset.asset_name} (${this.state.changeTrustAsset.asset_code})` : 'Add Asset'}
        </ModalHeader>
        <ModalBody>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            {this.state.changeTrustAsset ? `Are you sure you want to add ${this.state.changeTrustAsset.asset_name} (${this.state.changeTrustAsset.asset_code}) ?` : ''}
            <FormText color='info' style={{fontSize: '0.75rem', marginTop: '0.75rem'}}>
              <i className="fa fa-exclamation-triangle" style={{marginRight: '0.15rem', marginLeft: '0.15rem'}}/>
              {`This will allow you to receive/send and trade this asset. You can always remove this asset as long as your balance is 0.`}
            </FormText>
          </div>
        </ModalBody>
        <ModalFooter>
          <ActionButton
            processing={ this.state.changeTrustInProcess }
            title={ btnTitle }
            isForm={ false }
            actionClicked={ this.changeTrust }
          />
        </ModalFooter>
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
    const stellarAsset = this.props.assets[0]
    const availableBalance = stellarAsset.balance - stellarAsset.minimumBalance.minimumBalanceAmount
    if (availableBalance < 0.5) {
      this.setState({
        alertOpen: true,
        alertMessage: 'Unable to add asset - insufficient funds. Minimum balance should be greater than 0.50 XLM.'
      })
    } else {
      this.setState({
        showAddSupportedAssetModal: true,
        changeTrustAsset: asset
      })
    }
  }

  toggleAddSupportedAssetModal () {
    this.setState({
      showAddSupportedAssetModal: !this.state.showAddSupportedAssetModal
    })
  }

  toggleAddAssetModal () {
    this.setState({
      showAddAssetModal: !this.state.showAddAssetModal
    })
  }

  handleAddAssetSubmission = async () => {
    //Update current account to the first in the list after change trust is processed
    const updatedCurrentAsset = this.props.assets[0]
    await this.props.setCurrentAccount(updatedCurrentAsset)
    this.setState({
      assetSelected: 0,
      showAddAssetModal: false
    })
  }

  changeTrust = async () => {
    this.setState({ changeTrustInProcess: true })
    await this.props.changeTrustOperation(this.state.changeTrustAsset, false)
    await this.refreshAccounts()
    this.setState({ showAddSupportedAssetModal: false, changeTrustInProcess: false })
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