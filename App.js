import React from "react";
import {
  Alert,
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  StatusBar
} from "react-native";
import { Font, KeepAwake } from "expo";

const backgroundColors = [
  "#2c2c2c",
  "#a5c40c",
  "#ea00ff",
  "#3180f1",
  "#c4260c",
  "#e1e1e1",
  "#e68910",
  "#fff600"
];
const fontColors = [
  "#ea00ff",
  "#3180f1",
  "#a5c40c",
  "#c4260c",
  "#e1e1e1",
  "#404040",
  "#e68910",
  "#fff600"
];

const screenDims = Dimensions.get("screen");

class PlayerView extends React.Component {
  state = {
    backgroundColorIndex: 0,
    fontColorIndex: 2,
    modalVisible: false
  };

  _handleBackgroundPress = () => {
    this.setState(state => {
      return {
        backgroundColorIndex:
          (state.backgroundColorIndex + 1) % backgroundColors.length
      };
    });
  };

  _handleFontColorPress = () => {
    this.setState(state => {
      return {
        fontColorIndex: (state.fontColorIndex + 1) % fontColors.length
      };
    });
  };

  _handleInc = () => {
    const { onPointsUpdate, points } = this.props;

    if (points === 250) return;

    onPointsUpdate(points + 1);
  };

  _handleDec = () => {
    const { onPointsUpdate, points } = this.props;

    onPointsUpdate(Math.max(0, points - 1));
  };

  _handleHeartPress = () => {
    this.setState(state => {
      return { modalVisible: !state.modalVisible };
    });
  };

  _handleModalPointUpdate = points => {
    const { onPointsUpdate } = this.props;
    this.setState({ modalVisible: false }, () => onPointsUpdate(points));
  };

  _renderModal = () => {
    return (
      <View style={styles.modalWrap}>
        <TouchableOpacity
          style={styles.modalOption}
          onPress={() => this._handleModalPointUpdate(20)}
        >
          <Text style={styles.modalOptionText}>20</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.modalOption}
          onPress={() => this._handleModalPointUpdate(30)}
        >
          <Text style={styles.modalOptionText}>30</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.modalOption}
          onPress={() => this._handleModalPointUpdate(40)}
        >
          <Text style={styles.modalOptionText}>40</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const backgroundColor = backgroundColors[this.state.backgroundColorIndex];
    const fontColor = fontColors[this.state.fontColorIndex];
    const { points, onPointsUpdate } = this.props;
    const { modalVisible } = this.state;

    return (
      <View
        style={[
          styles.playerViewWrapper,
          { backgroundColor: backgroundColor },
          this.props.style
        ]}
      >
        <TouchableOpacity onPress={this._handleDec}>
          <Text style={[styles.textLeft, { color: fontColor }]}>-</Text>
        </TouchableOpacity>
        <Text style={[styles.textCenter, { color: fontColor }]}>
          {points.toString()}
        </Text>
        <TouchableOpacity onPress={this._handleInc}>
          <Text style={[styles.textRight, { color: fontColor }]}>+</Text>
        </TouchableOpacity>

        <View style={styles.bottomToolbarWrapper}>
          <Image
            resizeMode="contain"
            source={require("./assets/toolbar.png")}
            style={styles.toolbarImage}
          />

          <View style={styles.toolbarIconWrapper}>
            <TouchableOpacity
              onPress={this._handleBackgroundPress}
              style={styles.toolbarIcon}
            >
              <Image
                style={styles.toolbarIconImage}
                resizeMethod="resize"
                source={require("./assets/icon-background.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this._handleFontColorPress}
              style={styles.toolbarIcon}
            >
              <Image
                style={styles.toolbarIconImage}
                resizeMethod="resize"
                source={require("./assets/icon-paint.png")}
              />
            </TouchableOpacity>

            <View style={{ alignItems: "center" }}>
              {!!modalVisible && this._renderModal()}
              <TouchableOpacity
                onPress={this._handleHeartPress}
                style={styles.toolbarIcon}
              >
                <Image
                  style={styles.toolbarIconImage}
                  resizeMethod="resize"
                  source={require("./assets/icon-heart.png")}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default class App extends React.Component {
  state = {
    isLoading: true,
    player1Points: 20,
    player2Points: 20
  };

  componentDidMount() {
    Font.loadAsync({ bahnschrift: require("./assets/bahnschrift.ttf") }).then(
      () => {
        this.setState({ isLoading: false });
      }
    );
    StatusBar.setHidden(true);
    KeepAwake.activate();
  }

  componentDidUnmount() {
    KeepAwake.deactivate();
  }

  _handlePlayer1PointUpdate = points => {
    this.setState({ player1Points: points });
  };

  _handlePlayer2PointUpdate = points => {
    this.setState({ player2Points: points });
  };

  _resetState = () => {
    this.setState({
      player1Points: 20,
      player2Points: 20
    });
  };

  _handleReset = () => {
    Alert.alert("Reset vitality", "Are you sure you want to reset vitality?", [
      { text: "Cancel" },
      { text: "Reset", onPress: this._resetState, style: "destructive" }
    ]);
  };

  render() {
    if (this.state.isLoading) return null;

    const { player1Points, player2Points } = this.state;

    return (
      <View style={styles.container}>
        <PlayerView
          points={player1Points}
          onPointsUpdate={this._handlePlayer1PointUpdate}
          style={{ transform: [{ rotate: "180deg" }] }}
        />

        <View style={styles.separatorLine} />
        <TouchableHighlight
          onPress={this._handleReset}
          style={styles.separatorImageWrap}
        >
          <Image
            source={require("./assets/icon-logo.png")}
            style={styles.separatorImage}
          />
        </TouchableHighlight>
        <PlayerView
          points={player2Points}
          onPointsUpdate={this._handlePlayer2PointUpdate}
        />
      </View>
    );
  }
}

const commonStyle = {
  textStyle: {
    fontFamily: "bahnschrift",
    fontSize: screenDims.width * 0.3,
    textShadowColor: "#000000",
    textShadowRadius: 6,
    textShadowOffset: { width: 0.1, height: 0.1 }
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //marginTop: StatusBar.currentHeight,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  playerViewWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  textLeft: {
    ...commonStyle.textStyle,
    width: screenDims.width * 0.2,
    textAlign: "right"
  },
  textCenter: {
    ...commonStyle.textStyle,
    flex: 1,
    textAlign: "center"
  },
  textRight: {
    ...commonStyle.textStyle,
    width: screenDims.width * 0.2,
    textAlign: "left"
  },

  modalWrap: {
    position: "absolute",
    flexDirection: "row",
    borderRadius: 6,
    bottom: "110%"
  },
  modalOption: {
    backgroundColor: "#404040",
    width: 40,
    height: 40,
    margin: 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#a5c40c"
  },
  modalOptionText: {
    ...commonStyle.textStyle,
    fontSize: 20,
    textShadowRadius: 2,
    color: "#a5c40c"
  },

  bottomToolbarWrapper: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  toolbarImage: {
    position: "absolute",
    width: screenDims.width,
    height: screenDims.height * 0.104
  },
  toolbarIconWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: screenDims.width * 0.8,
    alignItems: "flex-end",
    marginBottom: -screenDims.height * 0.008
  },
  toolbarIcon: {
    width: screenDims.height * 0.07,
    height: screenDims.height * 0.07
  },
  toolbarIconImage: { width: "100%", height: "100%" },

  separatorLine: {
    alignSelf: "stretch",
    height: 4,
    backgroundColor: "#404040",
    borderColor: "#000000",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    alignItems: "center"
  },
  separatorImageWrap: {
    width: screenDims.width * 0.2,
    height: screenDims.width * 0.2,
    borderRadius: screenDims.width * 0.1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#000000",
    backgroundColor: "#404040",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10
  },
  separatorImage: { width: "100%", height: "100%" }
});
