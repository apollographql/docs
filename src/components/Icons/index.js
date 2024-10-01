import PropTypes from 'prop-types';
import React from 'react';
import {Box} from '@chakra-ui/react';

import {ReactComponent as ApolloMark} from '@apollo/icons/logos/LogoSymbol.svg';
import {ReactComponent as ArrowDown} from '@apollo/icons/default/IconArrowDown.svg';
import {ReactComponent as ArrowLeft} from '@apollo/icons/default/IconArrowLeft.svg';
import {ReactComponent as ArrowRight} from '@apollo/icons/default/IconArrowRight.svg';
import {ReactComponent as ArrowUp} from '@apollo/icons/default/IconArrowUp.svg';
import {ReactComponent as Book} from '@apollo/icons/default/IconBook.svg';
import {ReactComponent as CSharp} from '@apollo/icons/default/IconCSharp.svg';
import {ReactComponent as Check} from '@apollo/icons/default/IconCheck.svg';
import {ReactComponent as ChevronDown} from '@apollo/icons/default/IconChevronDown.svg';
import {ReactComponent as ChevronLeft} from '@apollo/icons/default/IconChevronLeft.svg';
import {ReactComponent as ChevronRight} from '@apollo/icons/default/IconChevronRight.svg';
import {ReactComponent as ChevronUp} from '@apollo/icons/default/IconChevronUp.svg';
import {ReactComponent as CircleCheck} from '@apollo/icons/default/IconSuccess.svg';
import {ReactComponent as Close} from '@apollo/icons/default/IconClose.svg';
import {ReactComponent as Cloud} from '@apollo/icons/default/IconCloud.svg';
import {ReactComponent as CollapseList} from '@apollo/icons/default/IconCollapseList.svg';
import {ReactComponent as Connectors} from '@apollo/icons/default/IconConnectors.svg';
import {ReactComponent as Discord} from '@apollo/icons/default/IconDiscord.svg';
import {ReactComponent as Discourse} from '@apollo/icons/default/IconDiscourse.svg';
import {ReactComponent as Dislike} from '@apollo/icons/default/IconDislikeSolid.svg';
import {ReactComponent as Document} from '@apollo/icons/default/IconDocument.svg';
import {ReactComponent as DoubleChevronDown} from '@apollo/icons/default/IconDoubleChevronDown.svg';
import {ReactComponent as DoubleChevronLeft} from '@apollo/icons/default/IconDoubleChevronLeft.svg';
import {ReactComponent as DoubleChevronRight} from '@apollo/icons/default/IconDoubleChevronRight.svg';
import {ReactComponent as Education} from '@apollo/icons/default/IconEducation.svg';
import {ReactComponent as Enterprise} from '@apollo/icons/default/IconEnterpriseFeatures.svg';
import {ReactComponent as ExpandList} from '@apollo/icons/default/IconExpandList.svg';
import {ReactComponent as Explorer} from '@apollo/icons/default/IconExplorer.svg';
import {ReactComponent as Federation} from '@apollo/icons/default/IconHierarchy.svg';
import {ReactComponent as Flask} from '@apollo/icons/default/IconFlask.svg';
import {ReactComponent as GitHub} from '@apollo/icons/default/IconGitHubSolid.svg';
import {ReactComponent as GraphQL} from '@apollo/icons/default/IconGraphQL.svg';
import {ReactComponent as Home} from '@apollo/icons/default/IconHome.svg';
import {ReactComponent as Insights} from '@apollo/icons/default/IconInsights.svg';
import {ReactComponent as Java} from '@apollo/icons/default/IconJava.svg';
import {ReactComponent as Kotlin} from '@apollo/icons/default/IconKotlin.svg';
import {ReactComponent as LayoutModule} from '@apollo/icons/default/IconLayoutModule.svg';
import {ReactComponent as Like} from '@apollo/icons/default/IconLikeSolid.svg';
import {ReactComponent as Lock} from '@apollo/icons/default/IconLock.svg';
import {ReactComponent as Menu} from '@apollo/icons/default/IconMenu.svg';
import {ReactComponent as Moon} from '@apollo/icons/small/IconMoon.svg';
import {ReactComponent as NarrowViewport} from '@apollo/icons/default/IconNarrowViewport.svg';
import {ReactComponent as NodeJs} from '@apollo/icons/default/IconNodeJs.svg';
import {ReactComponent as Outlink} from '@apollo/icons/default/IconOutlink.svg';
import {ReactComponent as OutlinkSmall} from '@apollo/icons/small/IconOutlink.svg';
import {ReactComponent as Paperclip} from '@apollo/icons/default/IconAttach.svg';
import {ReactComponent as Pipeline} from '@apollo/icons/default/IconPipeline.svg';
import {ReactComponent as Preview} from '@apollo/icons/default/IconPreview.svg';
import {ReactComponent as Quote} from '@apollo/icons/default/IconQuote.svg';
import {ReactComponent as ReactIcon} from '@apollo/icons/default/IconReact.svg';
import {ReactComponent as Repository} from '@apollo/icons/default/IconRepository.svg';
import {ReactComponent as Rocket} from '@apollo/icons/default/IconRocket.svg';
import {ReactComponent as Router} from '@apollo/icons/default/IconRouter.svg';
import {ReactComponent as Satellite} from '@apollo/icons/default/IconSatellite3.svg';
import {ReactComponent as Schema} from '@apollo/icons/default/IconSchema.svg';
import {ReactComponent as Search} from '@apollo/icons/default/IconSearch.svg';
import {ReactComponent as Star} from '@apollo/icons/default/IconStar.svg';
import {ReactComponent as Summit} from '../../assets/icons/summit.svg'
import {ReactComponent as Sun} from '@apollo/icons/small/IconSun.svg';
import {ReactComponent as Swift} from '@apollo/icons/default/IconSwift.svg';
import {ReactComponent as Team} from '@apollo/icons/default/IconTeam.svg';
import {ReactComponent as Terminal} from '@apollo/icons/default/IconAppWindow.svg';
import {ReactComponent as Twitter} from '@apollo/icons/default/IconTwitterSolid.svg';
import {ReactComponent as TypeScript} from '@apollo/icons/default/IconTypeScript.svg';
import {ReactComponent as Unlock} from '@apollo/icons/default/IconUnlock.svg';
import {ReactComponent as WidenViewport} from '@apollo/icons/default/IconWidenViewport.svg';
import {ReactComponent as Youtube} from '@apollo/icons/default/IconYouTubeSolid.svg';

const CustomIcon = ({icon, isSolid, boxSize, ...props}) => {
  return (
    <Box
      as={icon}
      boxSize={boxSize ? boxSize : '1em'}
      fill={isSolid ? 'current' : 'none'}
      {...props}
    />
  );
};

CustomIcon.propTypes = {
  icon: PropTypes.elementType.isRequired,
  isSolid: PropTypes.bool,
  boxSize: PropTypes.string
};

export const ApolloKotlinIcon = () => <CustomIcon icon={Kotlin} />;
export const ApolloMarkIcon = () => <CustomIcon icon={ApolloMark} isSolid />;
export const ApolloClientIcon = () => <CustomIcon icon={ReactIcon} />;
export const ApolloIOSIcon = () => <CustomIcon icon={Swift} />;
export const ApolloServerIcon = () => <CustomIcon icon={Satellite} />;
export const ArrowDownIcon = () => <CustomIcon icon={ArrowDown} />;
export const ArrowLeftIcon = () => <CustomIcon icon={ArrowLeft} />;
export const ArrowRightIcon = () => <CustomIcon icon={ArrowRight} />;
export const ArrowUpIcon = () => <CustomIcon icon={ArrowUp} />;
export const BookIcon = () => <CustomIcon icon={Book} />;
export const CSharpIcon = () => <CustomIcon icon={CSharp} />;
export const CheckIcon = () => <CustomIcon icon={Check} />;
export const CircleCheckIcon = () => <CustomIcon icon={CircleCheck} />;
export const ChevronDownIcon = () => <CustomIcon icon={ChevronDown} />;
export const ChevronLeftIcon = () => <CustomIcon icon={ChevronLeft} />;
export const ChevronRightIcon = () => <CustomIcon icon={ChevronRight} />;
export const ChevronUpIcon = () => <CustomIcon icon={ChevronUp} />;
export const CloudIcon = () => <CustomIcon icon={Cloud} />;
export const CloseIcon = () => <CustomIcon icon={Close} />;
export const CollapseListIcon = () => <CustomIcon icon={CollapseList} />;
export const ConnectorsIcon = () => <CustomIcon icon={Connectors} />;
export const DeliveryIcon = () => <CustomIcon icon={Pipeline} />;
export const DiscordIcon = () => <CustomIcon icon={Discord} />;
export const DiscourseIcon = () => <CustomIcon icon={Discourse} />;
export const DislikeIcon = () => <CustomIcon icon={Dislike} isSolid />;
export const DoubleChevronDownIcon = () => (
  <CustomIcon icon={DoubleChevronDown} />
);
export const DoubleChevronLeftIcon = () => (
  <CustomIcon icon={DoubleChevronLeft} />
);
export const DoubleChevronRightIcon = () => (
  <CustomIcon icon={DoubleChevronRight} />
);
export const EnterpriseIcon = () => <CustomIcon icon={Enterprise} />;
export const ExpandListIcon = () => <CustomIcon icon={ExpandList} />;
export const ExplorerIcon = () => <CustomIcon icon={Explorer} />;
export const FederationIcon = () => <CustomIcon icon={Federation} />;
export const FlaskIcon = () => <CustomIcon icon={Flask} />;
export const GitHubIcon = () => <CustomIcon isSolid icon={GitHub} />;
export const GraphOSIcon = () => <CustomIcon icon={Schema} />;
export const GraphQLIcon = () => <CustomIcon icon={GraphQL} />;
export const GridIcon = () => <CustomIcon icon={LayoutModule} />;
export const HomeIcon = () => <CustomIcon icon={Home} />;
export const InsightsIcon = () => <CustomIcon icon={Insights} />;
export const JavaIcon = () => <CustomIcon icon={Java} />;
export const LikeIcon = () => <CustomIcon icon={Like} isSolid />;
export const LockIcon = () => <CustomIcon icon={Lock} />;
export const MenuIcon = () => <CustomIcon icon={Menu} />;
export const MetricsIcon = () => <CustomIcon icon={Insights} />;
export const MoonIcon = props => <CustomIcon icon={Moon} {...props} />;
export const NarrowViewportIcon = () => <CustomIcon icon={NarrowViewport} />;
export const NodeJsIcon = () => <CustomIcon icon={NodeJs} />;
export const OdysseyIcon = () => <CustomIcon icon={Education} />;
export const OrgIcon = () => <CustomIcon icon={Team} />;
export const OutlinkIcon = () => <CustomIcon icon={Outlink} />;
export const OutlinkSmallIcon = () => (
  <CustomIcon icon={OutlinkSmall} boxSize="0.75em" />
);
export const PaperclipIcon = () => <CustomIcon icon={Paperclip} />;
export const PipelineIcon = () => <CustomIcon icon={Pipeline} />;
export const PreviewIcon = () => <CustomIcon icon={Preview} />;
export const QuoteIcon = () => <CustomIcon icon={Quote} />;
export const RepositoryIcon = () => <CustomIcon icon={Repository} />;
export const RocketIcon = () => <CustomIcon icon={Rocket} />;
export const RoverIcon = () => <CustomIcon icon={Terminal} />;
export const RouterIcon = () => <CustomIcon icon={Router} />;
export const SearchIcon = () => <CustomIcon icon={Search} />;
export const StarIcon = () => <CustomIcon icon={Star} />;
export const SummitIcon = props => <CustomIcon icon={Summit} {...props} />;
export const SunIcon = props => <CustomIcon icon={Sun} {...props} />;
export const TechnotesIcon = () => <CustomIcon icon={Document} />;
export const TwitterIcon = () => <CustomIcon isSolid icon={Twitter} />;
export const TypescriptIcon = () => <CustomIcon icon={TypeScript} />;
export const UnlockIcon = () => <CustomIcon icon={Unlock} />;
export const WidenViewportIcon = () => <CustomIcon icon={WidenViewport} />;
export const YoutubeIcon = () => <CustomIcon isSolid icon={Youtube} />;

export const DOCSET_ICONS = {
  default: <ApolloMarkIcon />,
  'apollo-client': <ApolloClientIcon />,
  'apollo-ios-dev': <ApolloIOSIcon />,
  'apollo-kotlin': <ApolloKotlinIcon />,
  'apollo-server': <ApolloServerIcon />,
  community: <ApolloMarkIcon />,
  connectors: <ConnectorsIcon />,
  federation: <FederationIcon />,
  graphos: <GraphOSIcon />,
  'graphos/cloud-routing': <CloudIcon />,
  'graphos/delivery': <PipelineIcon />,
  'graphos/enterprise': <EnterpriseIcon />,
  'graphos/explorer': <ExplorerIcon />,
  'graphos/metrics': <MetricsIcon />,
  'graphos/org': <OrgIcon />,
  rover: <RoverIcon />,
  router: <RouterIcon />,
  technotes: <TechnotesIcon />
};
