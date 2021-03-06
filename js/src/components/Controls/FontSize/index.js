/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  fontSizes,
  toggleCustomInlineStyle,
  getSelectionCustomInlineStyle,
} from 'draftjs-utils';
import classNames from 'classnames';
import { Dropdown, DropdownOption } from '../../Dropdown';
import styles from './styles.css'; // eslint-disable-line no-unused-vars

export default class FontSize extends Component {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    editorState: PropTypes.object,
    modalHandler: PropTypes.object,
    config: PropTypes.object,
  };

  state: Object = {
    currentFontSize: undefined,
    defaultFontSize: undefined,
  };

  componentWillMount(): void {
    const { editorState } = this.props;
    if (editorState) {
      this.setState({
        currentFontSize:
          getSelectionCustomInlineStyle(editorState, ['FONTSIZE']).FONTSIZE,
      });
    }
  }

  componentDidMount(): void {
    const editorElm = document.getElementsByClassName('DraftEditor-root');
    if (editorElm && editorElm.length > 0) {
      const styles = window.getComputedStyle(editorElm[0]);
      let defaultFontSize = styles.getPropertyValue('font-size');
      defaultFontSize = defaultFontSize.substring(0, defaultFontSize.length - 2);
      this.setState({
        defaultFontSize,
      });
    }
  }

  componentWillReceiveProps(properties: Object): void {
    if (properties.editorState &&
      this.props.editorState !== properties.editorState) {
      this.setState({
        currentFontSize:
          getSelectionCustomInlineStyle(properties.editorState, ['FONTSIZE']).FONTSIZE,
      });
    }
  }

  toggleFontSize: Function = (fontSize: number) => {
    const { editorState, onChange } = this.props;
    const fontSizeStr = fontSize && (fontSize.toString() || '');
    const newState = toggleCustomInlineStyle(
      editorState,
      'fontSize',
      fontSizeStr,
    );
    if (newState) {
      onChange(newState);
    }
  };

  render() {
    const { config: { icon, className }, modalHandler } = this.props;
    let { config: { options } } = this.props;
    let { currentFontSize, defaultFontSize } = this.state;
    defaultFontSize = Number(defaultFontSize);
    currentFontSize = (currentFontSize
      && Number(currentFontSize.substring(9, currentFontSize.length))) ||
      (options && options.indexOf(defaultFontSize) >= 0 && defaultFontSize);
    return (
      <div className="rdw-fontsize-wrapper" aria-label="rdw-font-size-control">
        <Dropdown
          className={classNames('rdw-fontsize-dropdown', className)}
          onChange={this.toggleFontSize}
          modalHandler={modalHandler}
        >
          {currentFontSize ?
            <span>{currentFontSize}</span>
          :
            <img
              src={icon}
              alt=""
            />
          }
          {
            options.map((size, index) =>
              <DropdownOption
                className="rdw-fontsize-option"
                active={currentFontSize === size}
                value={`fontsize-${size}`}
                key={index}
              >
                {size}
              </DropdownOption>
            )
          }
        </Dropdown>
      </div>
    );
  }
}
