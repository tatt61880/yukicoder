//{{{
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
#define rep(...) repN((__VA_ARGS__,rep3,rep2,loop,~))(__VA_ARGS__)
#define loop(n) rep2(_loop_,n)
#define rep2(i,n) rep3(i,0,n)
#define rep3(i,begin,end) for(int i=(int)(begin),i##_end=(int)(end);i<i##_end;++i)
#define repN(a) repX a
#define repX(a0,a1,a2,x,...) x
const int MOD = 1e9+7;
//}}}

int main(){
	int a, b;
	cin >> a >> b;
	rep(j,1,601){
		int i=j;
		i-=min(b,i/5)*5;
		if(i<=a)cout<<j<<endl;
	}
	return 0;
}
