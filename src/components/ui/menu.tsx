import { Menu } from '@headlessui/react'

const links = [
	{ href: '/account-settings', label: 'Account settings' },
	{ href: '/support', label: 'Support' },
	{ href: '/license', label: 'License' },
	{ href: '/sign-out', label: 'Sign out' },
]

export default function MenuDropdown() {
	return (
		<Menu>
			<Menu.Button>Options</Menu.Button>
			<Menu.Items>
				{links.map((link) => (
					<Menu.Item
						as="a"
						key={link.href}
						href={link.href}
						className="ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black"
						>
						{link.label}
					</Menu.Item>
				))}
			</Menu.Items>
		</Menu>
	)
}
