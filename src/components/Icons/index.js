import PropTypes from 'prop-types';
import React from 'react';
import {Box} from '@chakra-ui/react';

import {ReactComponent as ApolloMark} from '@apollo/icons/logos/LogoSymbol.svg';
import {ReactComponent as ArrowRight} from '@apollo/icons/default/IconArrowRight.svg';
import {ReactComponent as Book} from '@apollo/icons/default/IconBook.svg';
import {ReactComponent as CSharp} from '@apollo/icons/default/IconCSharp.svg';
import {ReactComponent as ChevronDown} from '@apollo/icons/default/IconChevronDown.svg';
import {ReactComponent as Connectors} from '@apollo/icons/default/IconConnectors.svg';
import {ReactComponent as Discord} from '@apollo/icons/default/IconDiscord.svg';
import {ReactComponent as Discourse} from '@apollo/icons/default/IconDiscourse.svg';
import {ReactComponent as Document} from '@apollo/icons/default/IconDocument.svg';
import {ReactComponent as Education} from '@apollo/icons/default/IconEducation.svg';
import {ReactComponent as Enterprise} from '@apollo/icons/default/IconEnterpriseFeatures.svg';
import {ReactComponent as Explorer} from '@apollo/icons/default/IconExplorer.svg';
import {ReactComponent as Federation} from '@apollo/icons/default/IconHierarchy.svg';
import {ReactComponent as GitHub} from '@apollo/icons/default/IconGitHubSolid.svg';
import {ReactComponent as GraphQL} from '@apollo/icons/default/IconGraphQL.svg';
import {ReactComponent as Home} from '@apollo/icons/default/IconHome.svg';
import {ReactComponent as Insights} from '@apollo/icons/default/IconInsights.svg';
import {ReactComponent as Java} from '@apollo/icons/default/IconJava.svg';
import {ReactComponent as Kotlin} from '@apollo/icons/default/IconKotlin.svg';
import {ReactComponent as LayoutModule} from '@apollo/icons/default/IconLayoutModule.svg';
import {ReactComponent as NodeJs} from '@apollo/icons/default/IconNodeJs.svg';
import {ReactComponent as Pipeline} from '@apollo/icons/default/IconPipeline.svg';
import {ReactComponent as ReactIcon} from '@apollo/icons/default/IconReact.svg';
import {ReactComponent as Rocket} from '@apollo/icons/default/IconRocket.svg';
import {ReactComponent as Router} from '@apollo/icons/default/IconRouter.svg';
import {ReactComponent as Satellite} from '@apollo/icons/default/IconSatellite3.svg';
import {ReactComponent as Schema} from '@apollo/icons/default/IconSchema.svg';
import {ReactComponent as Success} from '@apollo/icons/default/IconSuccess.svg';
import {ReactComponent as Swift} from '@apollo/icons/default/IconSwift.svg';
import {ReactComponent as Team} from '@apollo/icons/default/IconTeam.svg';
import {ReactComponent as Terminal} from '@apollo/icons/default/IconAppWindow.svg';
import {ReactComponent as Twitter} from '@apollo/icons/default/IconTwitterSolid.svg';
import {ReactComponent as Youtube} from '@apollo/icons/default/IconYouTubeSolid.svg';

const CustomIcon = ({icon}) => <Box fill="color" boxSize="1em" as={icon} />;
const SolidIcon = ({icon}) => <Box fill="current" boxSize="1em" as={icon} />;

CustomIcon.propTypes = {
  icon: PropTypes.elementType.isRequired
};

SolidIcon.propTypes = {
  icon: PropTypes.elementType.isRequired
};

export const ApolloClientIcon = <CustomIcon icon={ReactIcon} />;
export const ApolloIOSIcon = <CustomIcon icon={Swift} />;
export const ApolloKotlinIcon = <CustomIcon icon={Kotlin} />;
export const ApolloMarkIcon = <CustomIcon icon={ApolloMark} />;
export const ApolloServerIcon = <CustomIcon icon={Satellite} />;
export const ArrowRightIcon = <CustomIcon icon={ArrowRight} />;
export const BookIcon = <CustomIcon icon={Book} />;
export const CheckIcon = <CustomIcon icon={Success} />;
export const ChevronDownIcon = <CustomIcon icon={ChevronDown} />;
export const ConnectorsIcon = <CustomIcon icon={Connectors} />;
export const CSharpIcon = <CustomIcon icon={CSharp} />;
export const DiscordIcon = <CustomIcon icon={Discord} />;
export const DiscourseIcon = <CustomIcon icon={Discourse} />;
export const DeliveryIcon = <CustomIcon icon={Pipeline} />;
export const EnterpriseIcon = <CustomIcon icon={Enterprise} />;
export const ExplorerIcon = <CustomIcon icon={Explorer} />;
export const FederationIcon = <CustomIcon icon={Federation} />;
export const GitHubIcon = <SolidIcon icon={GitHub} />;
export const GraphOSIcon = <CustomIcon icon={Schema} />;
export const GraphQLIcon = <CustomIcon icon={GraphQL} />;
export const GridIcon = <CustomIcon icon={LayoutModule} />;
export const HomeIcon = <CustomIcon icon={Home} />;
export const JavaIcon = <CustomIcon icon={Java} />;
export const MetricsIcon = <CustomIcon icon={Insights} />;
export const NodeJsIcon = <CustomIcon icon={NodeJs} />;
export const OdysseyIcon = <CustomIcon icon={Education} />;
export const OrgIcon = <CustomIcon icon={Team} />;
export const PipelineIcon = <CustomIcon icon={Pipeline} />;
export const RocketIcon = <CustomIcon icon={Rocket} />;
export const RoverIcon = <CustomIcon icon={Terminal} />;
export const RouterIcon = <CustomIcon icon={Router} />;
export const TechnotesIcon = <CustomIcon icon={Document} />;
export const TwitterIcon = <SolidIcon icon={Twitter} />;
export const YoutubeIcon = <SolidIcon icon={Youtube} />;

export const DOCSET_ICONS = {
  default: <ApolloMarkIcon />,
  'apollo-client': <ApolloClientIcon />,
  'apollo-ios': <ApolloIOSIcon />,
  'apollo-kotlin': <ApolloKotlinIcon />,
  'apollo-server': <ApolloServerIcon />,
  connectors: <ConnectorsIcon />,
  delivery: <PipelineIcon />,
  enterprise: <EnterpriseIcon />,
  explorer: <ExplorerIcon />,
  federation: <FederationIcon />,
  graphos: <GraphOSIcon />,
  metrics: <MetricsIcon />,
  org: <OrgIcon />,
  rover: <RoverIcon />,
  router: <RouterIcon />,
  technotes: <TechnotesIcon />
};
