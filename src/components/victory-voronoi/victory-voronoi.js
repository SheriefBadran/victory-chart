import React from "react";
import { partialRight } from "lodash";
import {
  PropTypes as CustomPropTypes, Helpers, VictoryLabel, addEvents,
  VictoryContainer, VictoryTheme, DefaultTransitions, Voronoi, Data, Domain, Log
} from "victory-core";
import VoronoiHelpers from "./helper-methods";
import { BaseProps, DataProps } from "../../helpers/common-props";

const fallbackProps = {
  width: 450,
  height: 300,
  padding: 50
};

const animationWhitelist = [
  "data", "domain", "height", "padding", "samples", "size", "style", "width"
];

class VictoryVoronoi extends React.Component {
  static displayName = "VictoryVoronoi";
  static role = "voronoi";
  static defaultTransitions = DefaultTransitions.discreteTransitions();

  static propTypes = {
    ...BaseProps,
    ...DataProps,
    size: CustomPropTypes.nonNegative
  };

  static defaultProps = {
    samples: 50,
    scale: "linear",
    standalone: true,
    dataComponent: <Voronoi/>,
    labelComponent: <VictoryLabel/>,
    containerComponent: <VictoryContainer/>,
    groupComponent: <g role="presentation"/>,
    theme: VictoryTheme.grayscale
  };

  static getDomain = Domain.getDomain.bind(Domain);
  static getData = Data.getData.bind(Data);
  static getBaseProps = partialRight(
    VoronoiHelpers.getBaseProps.bind(VoronoiHelpers), fallbackProps);
  static expectedComponents = [
    "dataComponent", "labelComponent", "groupComponent", "containerComponent"
  ];

  componentDidMount() {
    Log.warn(
      "`VictoryVoronoi` will be deprecated in victory@0.20.0, use `VictoryVoronoiContainer` instead"
    );
  }

  // Overridden in native versions
  shouldAnimate() {
    return !!this.props.animate;
  }

  render() {
    const { role } = this.constructor;
    const props = Helpers.modifyProps(this.props, fallbackProps, role);
    if (this.shouldAnimate()) {
      return this.animateComponent(props, animationWhitelist);
    }
    const children = this.renderData(props);
    return props.standalone ? this.renderContainer(props.containerComponent, children) : children;
  }
}

export default addEvents(VictoryVoronoi);
