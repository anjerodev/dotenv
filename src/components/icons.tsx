import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Copy,
  Edit,
  Eye,
  FileJson,
  FolderClosed,
  GitCommit,
  GitFork,
  Github,
  GitPullRequest,
  Globe,
  Hand,
  Info,
  LifeBuoy,
  Loader2,
  Lock,
  LogOut,
  LucideProps,
  Moon,
  MoreVertical,
  Plus,
  Save,
  Search,
  Settings2,
  Star,
  Sun,
  Trash2,
  Twitter,
  Undo2,
  User,
  Users2,
  Wand2,
  X,
  type LucideIcon,
} from 'lucide-react'

export type Icon = LucideIcon

export const Icons = {
  close: X,
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  arrowRight: ArrowRight,
  wand: Wand2,
  trash: Trash2,
  user: User,
  edit: Edit,
  github: Github,
  twitter: Twitter,
  check: Check,
  doubleCheck: CheckCheck,
  website: Globe,
  hold: Hand,
  plus: Plus,
  save: Save,
  settings: Settings2,
  menu: MoreVertical,
  undo: Undo2,
  copy: Copy,
  file: FileJson,
  search: Search,
  lock: Lock,
  team: Users2,
  moon: Moon,
  sun: Sun,
  projects: FolderClosed,
  help: LifeBuoy,
  logOut: LogOut,
  alert: AlertTriangle,
  info: Info,
  circle: Circle,
  commit: GitCommit,
  pullRequest: GitPullRequest,
  fork: GitFork,
  star: Star,
  subscribers: Users2,
  watchers: Eye,
  openSource: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="2"
      strokeLinecap="round"
      {...props}
    >
      <path d="M15.09 21.51a10 10 0 1 0-6.18 0l2.142-6.594a3.067 3.067 0 1 1 1.896 0l2.142 6.595Z" />
    </svg>
  ),
}
